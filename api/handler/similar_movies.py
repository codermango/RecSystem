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
            'allmovie_attributes': 1,
            'allmovie_moods': 1,
            'allmovie_keywords': 1,
            'allmovie_subgenres': 1,
            'allmovie_themes': 1
        }
        result_dict = {}

        
        # result_dict['weighted'] = recommend(movieid, int(recnum), allmovie_feature_weight_dict, True)
        result_dict['unweighted'] = recommend(movieid, int(recnum), allmovie_feature_weight_dict, False)

        # recommended_ids = [x['movieid'] for x in result_dict['unweighted']]
        # client = MongoClient()
        # db = client['VionelDB']
        # col = db['Plejmo']

        # docs = col.find({'imdbID': {'$in': recommended_ids}}, {'imdbID': 1, 'posterURL': 1, '_id': 0})
        # for doc in docs:
        #     for movie in result_dict['unweighted']:
        #         if 
        # imdbID_poster_dict = [
        #     {
        #         'imdbID': x['imdbID'],
        #         'posterURL': x['posterURL']
        #     } 
        #     for x in docs if x['posterURL'] != ''
        # ]


        # client.close()
        self.write(result_dict)