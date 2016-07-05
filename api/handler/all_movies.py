#!/usr/bin/env python
#coding:utf-8
import sys
import json
import tornado.web
from pymongo import MongoClient
from libs.poster_url import get_poster_url


DB_HOST = '192.168.1.80'
DB_PORT = 27017
DB_NAME = 'VionelDB'
DB_COLLECTION = 'Plejmo'

reload(sys)
sys.setdefaultencoding('utf-8')

class AllMoviesHandler(tornado.web.RequestHandler):
    def get(self):

        self.set_header("Content-Type", "application/json")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "GET")

        client = MongoClient(DB_HOST, DB_PORT)
        db = client[DB_NAME]
        col = db[DB_COLLECTION]

        docs = col.find({}, {'imdbID': 1, 'posterURL': 1, '_id': 0})
        imdbID_poster_dict = [
            {
                'imdbID': x['imdbID'],
                'posterURL': x['posterURL']
            } 
            for x in docs if x['posterURL'] != ''
        ]

        client.close()

        self.write(json.dumps(imdbID_poster_dict))

