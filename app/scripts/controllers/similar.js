'use strict';

angular.module('RecSystemWebApp')
    .controller('SimilarCtrl', function ($scope, $http, $routeParams, $location) {
        $scope.movieID = $routeParams.movieid;
        $scope.recNum = $routeParams.recnum;

        $http.get('http://127.0.0.1:8888/similar_movies/' + $scope.movieID + '/' + $scope.recNum + '/').success(function(data) {
            $scope.recMovies = data;
            console.log($scope.recMovies);
        });

        console.log($scope.imdbid);
        $scope.recommend = function(imdbid, recNum) {
            if (imdbid == undefined || imdbid.trim() == '' ) {
                var inputErrorDialog = $("#inputErrorDialog").data('dialog');
                if (!inputErrorDialog.element.data('opened')) {
                    inputErrorDialog.open();
                } else {
                    inputErrorDialog.close();
                }
                return;
            }
            $location.path('/similar/' + imdbid + '/10/');
        };
    });
