#!/usr/bin/env python
#coding:utf-8
import tornado.web
from libs.simmovie import recommend


class SimilarMoviesHandler(tornado.web.RequestHandler):
    def get(self, movieid, recnum):
        self.set_header("Content-Type", "application/json")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "GET")

        all_feature_weight_dict = {
            'actor': 1,
            'genre': 1, 
            'keyword': 1, 
            'director': 1, 
            'allmovie_attribute': 1,
            'allmovie_mood': 1,
            'allmovie_keyword': 1,
            'allmovie_subgenre': 1,
            'allmovie_theme': 1
        }
        allmovie_feature_weight_dict = {
            'allmovie_attribute': 1,
            'allmovie_mood': 1,
            'allmovie_keyword': 1,
            'allmovie_subgenre': 1,
            'allmovie_theme': 1
        }
        result_dict = {}
        result_dict['basic'] = recommend(movieid, int(recnum))
        result_dict['all'] = recommend(movieid, int(recnum), all_feature_weight_dict)
        result_dict['allmovie'] = recommend(movieid, int(recnum), allmovie_feature_weight_dict)

        self.write(result_dict)