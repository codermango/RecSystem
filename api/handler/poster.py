#!/usr/bin/env python
#coding:utf-8
import tornado.web
from libs.poster_url import get_poster_url


class PosterHandler(tornado.web.RequestHandler):
    def get(self, movieid):
        self.set_header("Content-Type", "application/json")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "GET")

        result_dict = {}
        result_dict['poster_url'] = get_poster_url(movieid)


        self.write(result_dict)