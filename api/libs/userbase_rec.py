#!coding=utf-8
from __future__ import division
import json
import sys
import time
import math
from collections import Counter
from pprint import pprint
from pymongo import MongoClient
from gensim import matutils



mongo_client = MongoClient()
collection = mongo_client['LocalTestDB']['MoviesForRec']
tfidf_col = mongo_client['LocalTestDB']['TfidfReference']

# feature_weight_dict = {'director': 5.6, 'genre': 2.2, 'keyword': 9.5, 'actor': 4.8 }
# feature_weight_dict = {'actor': 1,
#                        'genre': 1, 
#                        'keyword': 1, 
#                        'director': 1, 
#                        'allmovie_attribute': 1,
#                        'allmovie_mood': 1,
#                        'allmovie_keyword': 1,
#                        'allmovie_subgenre': 1,
#                        'allmovie_theme': 1}

feature_weight_dict = {'actor': 1, 'genre': 1, 'keyword': 1, 'director': 1}

movie_count = collection.find().count()
reference = tfidf_col.find()
reference_dict = {}
for item in reference:
    key_list = item.keys()
    key_list.remove('_id')
    reference_dict[key_list[0]] = item[key_list[0]]


# pprint(reference_dict['genre'])

def cosine_of_lists(list1, list2):
    intersection = list(set(list1).intersection(set(list2)))
    cosine_value = 0.0

    if intersection:
        cosine_value = len(intersection) / (math.sqrt(len(list1)) * math.sqrt(len(list2)))

    return cosine_value



def cosine_by_tfidf(list1, list2, feature):

    cosine_value = 0.0

    intersection_set = set(list1) & set(list2)

    if intersection_set:
        union_set = set(list1) | set(list2)

        feature_count = {}
        for item in union_set:
            feature_count[item] = reference_dict[feature][item]
            
            # feature_count[item] = collection.find({feature: {'$in': [item]}}).count()

        list1_dict = dict(Counter(list1))
        list2_dict = dict(Counter(list2))

        # pprint(list1_dict)
        # pprint(list2_dict)

        num1 = len(list1)
        num2 = len(list2)

        list1_tfidf_dict = {}
        for k, v in list1_dict.items():
            list1_tfidf_dict[k] = (v / num1) * math.log(movie_count / feature_count[k])

        list2_tfidf_dict = {}
        for k, v in list2_dict.items():
            list2_tfidf_dict[k] = (v / num2) * math.log(movie_count / feature_count[k])


        # pprint(list1_tfidf_dict)
        # pprint(list2_tfidf_dict)

        cosine_value = matutils.cossim(list1_tfidf_dict, list2_tfidf_dict)

    # print cosine_value
    return cosine_value







def get_movieid_sim_dict(movies, feature):

    movieid_sim_dict = {}
    allmovies = collection.find({}, {'imdbID': 1, feature: 1, '_id': 0})

    given_feature_list = []
    for movie in movies:
        given_feature_list += movie[feature]

    # pprint(given_feature_list)
    # cosine_value = 0.0
    for movie in allmovies:
        # print feature
        feature_list = movie[feature]
        cosine_value = cosine_by_tfidf(given_feature_list, feature_list, feature)
        movieid_sim_dict[movie['imdbID']] = cosine_value

    # pprint(movieid_sim_dict)
    return movieid_sim_dict


def recommend(input_movie_list, num_to_rec):
    """Return recommended movies and the features that contribute most in this recommendation."""
    # First check if the ids are existed.
    user_movie_cursor = collection.find({'imdbID': {'$in': input_movie_list}})
    assert user_movie_cursor.count() != 0, 'All the movies are not in our database!'
    user_movies = []
    map(lambda x: user_movies.append(x), user_movie_cursor)


    feature_movieid_sim_dict = {} # this is for record recommendation reasons
    final_counter = Counter()
    # print feature_weight_dict
    for feature in feature_weight_dict:
        # print feature
        movieid_sim_dict = get_movieid_sim_dict(user_movies, feature)
        # pprint(movieid_sim_dict)
        # break
        movieid_sim_dict.update((x, y * feature_weight_dict[feature]) for x, y in movieid_sim_dict.items())
        feature_movieid_sim_dict[feature] = movieid_sim_dict
        final_counter += Counter(movieid_sim_dict)

    # del final_counter[input_movie]
    map(lambda x: final_counter.__delitem__(x), input_movie_list)

    final_counter = final_counter.most_common(num_to_rec)
    # print final_counter

    detail_result_counter = Counter()
    for movieid, simscore in final_counter:
        feature_sim = {}
        feature_sim['sum'] = simscore
        for feature in feature_weight_dict:
            feature_sim[feature] = feature_movieid_sim_dict[feature][movieid]
        detail_result_counter[movieid] = feature_sim

    return dict(detail_result_counter)



if __name__ == '__main__':
    user_like_movieid_list = ['tt0468569', 'tt1345836', 'tt0372784']
    pprint(recommend(user_like_movieid_list, 5))