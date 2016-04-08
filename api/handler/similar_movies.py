#!/usr/bin/env python
#coding:utf-8
import tornado.web
from libs.simmovie import recommend


class SimilarMoviesHandler(tornado.web.RequestHandler):
    def get(self, movieid, recnum):
        self.set_header("Content-Type", "application/json")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "GET")

        result_dict = recommend(movieid, int(recnum))

        self.write(result_dict)