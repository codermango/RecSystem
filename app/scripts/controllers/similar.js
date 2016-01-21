'use strict';

angular.module('RecSystemWebApp')
    .controller('SimilarCtrl', function ($scope, $http, $routeParams, $location) {
        $scope.movieID = $routeParams.movieid;
        $scope.recNum = $routeParams.recnum;

        $http.get('http://192.168.1.80:8888/similar_movies/' + $scope.movieID + '/' + $scope.recNum + '/').success(function(data) {
            var sortableMovies = [];
            $scope.recReasons = new Object();
            for (var movieid in data.movie) {
                sortableMovies.push([movieid, data.movie[movieid]]);
                sortableMovies.sort(function(a, b) {return b[1] - a[1]});

                var sortableReasons = [];
                for (var feature in data.reason[movieid]) {
                    sortableReasons.push([feature, data.reason[movieid][feature]]);
                    // console.log(sortableReasons);
                }
                console.log(movieid + '    ' + sortableReasons);

                sortableReasons.sort(function(a, b) {return b[1] - a[1]});
                $scope.recReasons[movieid] = sortableReasons;
            }
            $scope.recMovies = sortableMovies;
            console.log($scope.recReasons);
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
            $location.path('/similar/' + imdbid + '/' + recNum + '/');
        };
    });
