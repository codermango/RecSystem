'use strict';

angular.module('RecSystemWebApp')
    .controller('CreditMoviesCtrl', function ($scope, $http, $routeParams, ENV) {
        $http.get(ENV.server + '/credit/movies/').success(function(data) {
            $scope.movieIDs = data;
        });

    });