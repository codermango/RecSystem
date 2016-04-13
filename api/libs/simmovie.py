#!coding=utf-8
import json
import sys
import time
import math
from collections import Counter
from pprint import pprint
from pymongo import MongoClient
# from vionmodels import *
# from vionsim import *


MONGO_CLIENT = MongoClient()
COLLECTION = MONGO_CLIENT['VionelDB']['Plejmo']

FEATURE_WEIGHT = {'director': 5.6, 'genre': 2.2, 'keyword': 9.5, 'actor': 4.8 }




def cosine_of_lists(list1, list2):
    intersection = list(set(list1).intersection(set(list2)))
    cosine_value = 0.0

    if intersection:
        cosine_value = len(intersection) / (math.sqrt(len(list1)) * math.sqrt(len(list2)))

    return cosine_value



def get_movieid_sim_dict(movie, feature):

    movieid_sim_dict = {}
    allmovies = COLLECTION.find({}, {'imdbID': 1, feature: 1, '_id': 0})

    given_feature_list = movie[feature]
    # print feature_list
    for movie in allmovies:
        try:
            feature_list = movie[feature]
            cosine_value = cosine_of_lists(given_feature_list, feature_list)
        except KeyError:
            cosine_value = 0
        
        movieid_sim_dict[movie['imdbID']] = cosine_value

    # pprint(movieid_sim_dict)
    return movieid_sim_dict


def recommend(input_movie, num_to_rec, feature_weight=FEATURE_WEIGHT):
    """Return recommended movies and the features that contribute most in this recommendation."""
    # First check if the id is existed.
    assert COLLECTION.find({'imdbID': input_movie}).count() != 0, input_movie + ' is not in our database!'
    movie = COLLECTION.find({'imdbID': input_movie}, {'_id': 0}).next()
    # print movie

    feature_movieid_sim_dict = {} # this is for record recommendation reasons
    final_counter = Counter()
    for feature in feature_weight:
        movieid_sim_dict = get_movieid_sim_dict(movie, feature)
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

    return dict(detail_result_counter)


# def recommend_for_pipeline(input_movieid, detail_result_dict):
#     input_movie = Movie()
#     input_movie.externalIDs = {}
#     input_movie.externalIDs.imdbID = input_movieid

#     max_sum = max([detail_result_dict[movieid]['sum'] for movieid in detail_result_dict.keys()])


#     result_list = []
#     for movieid, feature_dict in detail_result_dict.items():
#         movie = Movie()
#         movie.externalIDs = {}
#         movie.externalIDs.imdbID = movieid

#         max_feature_value = max(feature_dict.values())

#         similarity = Similarity()
#         similarity.value = feature_dict['sum'] / max_sum
#         similarity.vionElements.append(input_movie)
#         similarity.vionElements.append(movie)

#         director_similarity = DirectorOverlapSimilarity()
#         director_similarity.value = feature_dict['director'] / max_feature_value

#         actor_similarity = ActorOverlapSimilarity()
#         actor_similarity.value = feature_dict['actor'] / max_feature_value

#         keyword_similarity = KeywordOverlapSimilarity()
#         keyword_similarity.value = feature_dict['keyword'] / max_feature_value

#         genre_similarity = GenreOverlapSimilarity()
#         genre_similarity.value = feature_dict['genre'] / max_feature_value

#         similarity.weightedContributions.append(director_similarity)
#         similarity.weightedContributions.append(actor_similarity)
#         similarity.weightedContributions.append(keyword_similarity)
#         similarity.weightedContributions.append(genre_similarity)

#         result_list.append(similarity)

#     return result_list




if __name__ == '__main__':
    start = time.time()
    movieid = 'tt0468569'
    detail_result_dict = recommend(movieid, 5)
    # result_for_pipeline = recommend_for_pipeline(movieid, detail_result_dict)
    end = time.time()
    print end - start
    print detail_result_dict
    # pprint(detail_result_dict)
    # pprint([s.as_json() for s in result_for_pipeline])
    # pprint(result_for_pipeline)
