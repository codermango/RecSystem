'use strict';

angular.module('RecSystemWebApp')
    .controller('SimilarCtrl', function ($scope, $http) {
        $http.get('http://127.0.0.1:8888/similar_movies/tt0468569').success(function(data) {
            $scope.data = data;
            // $scope.movieID = $routeParams.movieid;
        });
    });
