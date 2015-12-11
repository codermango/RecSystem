'use strict';

angular.module('RecSystemWebApp')
    .controller('MainCtrl', function ($scope, $http) {
        $http.get('http://192.168.1.80:8888/all_movies').success(function(data) {
            var allMovies = data['all_movies'];
            $scope.moviesForShow = allMovies.slice(0, 64);

            $scope.loadMore = function() {
                var lastIndex = $scope.moviesForShow.length - 1;
                for(var i = 1; i <= 64; i++) {
                    $scope.moviesForShow.push(allMovies[lastIndex + i]);
                }
            };
        });
    });