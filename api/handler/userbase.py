#!/usr/bin/env python
#coding:utf-8
import tornado.web
from pymongo import MongoClient
from pprint import pprint
from libs.userbase_rec import recommend


class UserbaseHandler(tornado.web.RequestHandler):
    def get(self, userid, recnum):
        self.set_header("Content-Type", "application/json")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "GET")

        client = MongoClient('192.168.1.87')
        db = client['Hackathon']
        col = db['movielens_validation_iid2']

        docs = col.find({'userId': userid})
        user_liked_movies = docs.next()['likelist']
        movieid_list = [item['imdbId'] for item in user_liked_movies]
        pprint(movieid_list)

        client.close()

        result_dict = {}
        result_dict['rec'] = recommend(movieid_list, int(recnum))
        result_dict['liked_movies'] = movieid_list


        self.write(result_dict)

