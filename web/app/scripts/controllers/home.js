'use strict';

angular.module('RecSystemWebApp')
    .controller('HomeCtrl', function ($scope, $http, ENV) {
        $scope.server = ENV.server;
        $http({
            method: 'GET',
            url: $scope.server + '/allmovies/'
        }).then(function(data) {
            var allMovies = data['data'];
            $scope.moviesForShow = allMovies.slice(0, 64);
            // console.log($scope.moviesForShow);

            $scope.loadMore = function() {
                var lastIndex = $scope.moviesForShow.length - 1;
                for(var i = 1; i <= 64; i++) {
                    $scope.moviesForShow.push(allMovies[lastIndex + i]);
                }
            };
        }, function(data) {
            document.write(data.status);
        });
    });