#!coding=utf-8
import json
import sys
import time
import math
from collections import Counter
from pprint import pprint
from pymongo import MongoClient
from gensim import matutils
# from vionmodels import *
# from vionsim import *


MONGO_CLIENT = MongoClient()
# COLLECTION = MONGO_CLIENT['VionelDB']['AllMoviesForRec']
COLLECTION = MONGO_CLIENT['VionelDB']['Plejmo']

# FEATURE_WEIGHT = {'director': 5.6, 'genre': 2.2, 'keyword': 9.5, 'actor': 4.8 }

FEATURE_WEIGHT = {
    'allmovie_moods': 1, 
    'allmovie_subgenres': 1, 
    'allmovie_keywords': 1, 
    'allmovie_attributes': 1,
    'allmovie_themes': 1 
}

KEYWORD_WEIGHT_COL = MONGO_CLIENT['VionelDB']['allmovie_keyword_weights']
KEYWORD_WEIGHT = {item['title']: item['weight'] for item in KEYWORD_WEIGHT_COL.find()}
KEYWORDS = KEYWORD_WEIGHT.keys()


weighted_keywords = {item['imdbID']: {} for item in COLLECTION.find({}, {'imdbID': 1, '_id': 0})}
# print weighted_keywords
unweighted_keywords = {item['imdbID']: [] for item in COLLECTION.find({}, {'imdbID': 1, '_id': 0})}


def cosine_of_lists(list1, list2):
    intersection = list(set(list1).intersection(set(list2)))
    cosine_value = 0.0

    if intersection:
        cosine_value = len(intersection) / (math.sqrt(len(list1)) * math.sqrt(len(list2)))



    return cosine_value, intersection


def cosine_by_weight(list1, list2):
    intersection = list(set(list1).intersection(set(list2)))
    cosine_value = 0.0
    intersection_dict = {}

    if intersection:
        dict1 = dict(map(lambda k: (k, KEYWORD_WEIGHT[k]), filter(lambda x: x in list1 and x in KEYWORDS, list1)))
        dict2 = dict(map(lambda k: (k, KEYWORD_WEIGHT[k]), filter(lambda x: x in list2 and x in KEYWORDS, list2)))
        
        intersection_dict = dict(set(dict1.items()) & set(dict2.items()))
        # print dict1
        # print dict2
        # print intersection_dict
        # print 
        # print
        # print

        cosine_value = matutils.cossim(dict1, dict2)

    return cosine_value, intersection_dict





def get_movieid_sim_dict(movie, feature, is_weight):

    movieid_sim_dict = {}
    allmovies = COLLECTION.find({}, {'imdbID': 1, feature: 1, '_id': 0})

    given_feature_list = movie[feature]
    # print feature_list
    for movie in allmovies:
        try:
            feature_list = movie[feature]
            if is_weight:
                cosine_value, keyword = cosine_by_weight(given_feature_list, feature_list)
                weighted_keywords[movie['imdbID']].update(keyword)
                # print cosine_value, keyword
                # print
            else:
                cosine_value, keyword = cosine_of_lists(given_feature_list, feature_list)
                # print keyword
                # print
                unweighted_keywords[movie['imdbID']] = list(set(unweighted_keywords[movie['imdbID']] + keyword))
        except KeyError:
            cosine_value = 0
        
        movieid_sim_dict[movie['imdbID']] = cosine_value
        # break

    # pprint(movieid_sim_dict)
    return movieid_sim_dict


def recommend(input_movie, num_to_rec, feature_weight=FEATURE_WEIGHT, is_weight=False):
    """Return recommended movies and the features that contribute most in this recommendation."""
    # First check if the id is existed.
    assert COLLECTION.find({'imdbID': input_movie}).count() != 0, input_movie + ' is not in our database!'
    movie = COLLECTION.find({'imdbID': input_movie}, {'_id': 0}).next()
    # print movie

    feature_movieid_sim_dict = {} # this is for record recommendation reasons
    final_counter = Counter()
    for feature in feature_weight:

        movieid_sim_dict = get_movieid_sim_dict(movie, feature, is_weight)
        movieid_sim_dict.update((x, y * feature_weight[feature]) for x, y in movieid_sim_dict.items())
        feature_movieid_sim_dict[feature] = movieid_sim_dict
        final_counter += Counter(movieid_sim_dict)

    del final_counter[input_movie]

    final_counter = final_counter.most_common(num_to_rec)

    detail_result_counter = Counter()
    for movieid, simscore in final_counter:
        feature_sim = {}
        feature_sim['sum'] = simscore
        for feature in feature_weight:
            feature_sim[feature] = feature_movieid_sim_dict[feature][movieid]
        detail_result_counter[movieid] = feature_sim
        if is_weight:
            detail_result_counter[movieid]['words'] = weighted_keywords[movieid]
        else:
            detail_result_counter[movieid]['words'] = unweighted_keywords[movieid]

    return dict(detail_result_counter)



if __name__ == '__main__':
    start = time.time()
    movieid = 'tt0484562'
    detail_result_dict = recommend(movieid, 5, is_weight=False)
    # result_for_pipeline = recommend_for_pipeline(movieid, detail_result_dict)
    end = time.time()
    print end - start
    pprint(detail_result_dict)
    # pprint(weighted_keywords)
    # pprint(detail_result_dict)
    # pprint([s.as_json() for s in result_for_pipeline])
    # pprint(result_for_pipeline)
