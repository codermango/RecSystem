'use strict';

angular.module('RecSystemWebApp')
    .controller('SimilarCtrl', function ($scope, $http, $routeParams, $location) {
        $scope.movieID = $routeParams.movieid;
        $scope.recNum = $routeParams.recnum;
        $http.get('http://192.168.1.80:8888/similar_movies/' + $scope.movieID + '/' + $scope.recNum).success(function(data) {
            $scope.recMovies = data;
            console.log($scope.recMovies);
        });

        console.log($scope.imdbid);
        $scope.recommend = function(imdbid, recNum) {
            $location.path('/similar/' + imdbid + '/10');
        };
    });
