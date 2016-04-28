#!/usr/bin/env python
#coding:utf-8
import tornado.web
from libs.simmovie import recommend


class SimilarMoviesHandler(tornado.web.RequestHandler):
    def get(self, movieid, recnum):
        self.set_header("Content-Type", "application/json")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "GET")

        allmovie_feature_weight_dict = {
            # 'allmovie_attributes': 1,
            'allmovie_moods': 1,
            # 'allmovie_keywords': 1,
            'allmovie_subgenres': 1,
            'allmovie_themes': 1
        }
        result_dict = {}
        result_dict['weighted'] = recommend(movieid, int(recnum), allmovie_feature_weight_dict, True)
        result_dict['unweighted'] = recommend(movieid, int(recnum), allmovie_feature_weight_dict, False)


        self.write(result_dict)