#!/usr/bin/env python
#coding:utf-8
from pymongo import MongoClient
import tornado.web
import os
import json

class FetchCreditHandler(tornado.web.RequestHandler):
    def get(self, movieid):
        self.set_header("Content-Type", "application/json")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "GET")

        movieid = 'vnl.' + movieid

        dir_abspath = os.path.abspath(os.path.dirname(__file__)) + '/../data/credits/' + movieid
        try:
            filename_list = os.listdir(dir_abspath)
        except OSError:
            filename_list = []

        client = MongoClient('192.168.1.60')
        out_col = client['VionelMovies']['end_credit']
        movie = out_col.find_one({'vnlID': movieid})

        start_seconds = int(movie['start_seconds'][0] / 1e6)
        end_seconds = int(movie['end_seconds'][0] / 1e6)

        client.close()

        result_dict = {}
        result_dict['movieid'] = movieid
        result_dict['start_seconds'] = start_seconds
        result_dict['end_seconds'] = end_seconds
        result_dict['frames'] = filename_list

        self.write(json.dumps(result_dict))

class UpdateCreditHandler(tornado.web.RequestHandler):
    def get(self, movieid, startsec, endsec, is_updated):
        self.set_header("Content-Type", "application/json")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "GET")

        movieid = 'vnl.' + movieid

        client = MongoClient('192.168.1.60')
        out_col = client['VionelMovies']['credit_validation']

        doc = {}
        doc['vnlID'] = movieid
        doc['start_seconds'] = int(startsec)
        doc['end_seconds'] = int(endsec)
        doc['updated'] = True if is_updated == 'true' else False

        if out_col.find_one({'vnlID': movieid}):
            out_col.update({'vnlID': movieid}, doc)
        else:
            out_col.insert_one(doc)

        client.close()


class FetchMoviesHandler(tornado.web.RequestHandler):
    def get(self):
        self.set_header("Content-Type", "application/json")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "GET")

        client = MongoClient('192.168.1.60')
        col1 = client['VionelMovies']['end_credit']
        col2 = client['VionelMovies']['credit_validation']

        all_vnlIDs = col1.distinct("vnlID", {"credit_num": 1})
        updated_vnlIDs = col2.distinct("vnlID")
        vnlIDs = [x for x in all_vnlIDs if x not in updated_vnlIDs]

        client.close()

        self.write(json.dumps(vnlIDs))
