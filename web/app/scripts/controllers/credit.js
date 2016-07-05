'use strict';

angular.module('RecSystemWebApp')
    .controller('CreditCtrl', function ($scope, $http, $routeParams, ENV) {
        $scope.server = ENV.server;
        $scope.frameImages = [];
        $scope.movieid = $routeParams.movieid;
        $http.get(ENV.server + '/credit/' + $scope.movieid + '/').success(function(data) {
            console.log(data);
            
            $scope.frameImages = data["frames"].sort().map(item => Number(item.split(".")[0]));
            $scope.movieid = data["movieid"];
            $scope.startSec = Number(data["start_seconds"]);
            $scope.endSec = Number(data["end_seconds"]);
        });

        $scope.updateCredit = function(movieid, startSec, endSec, isUpdated) {
            if (isUpdated) {
                if (isNaN(startSec) && isNaN(endSec)) {
                    alert('Please input number!');
                    return;
                } else if (Number(startSec) >= Number(endSec)) {
                    alert('start seconds should be smaller than end seconds!');
                    return;
                }

            }
            $http.get(ENV.server + '/credit/' + movieid + '/' + startSec + '/' + endSec + '/' + isUpdated + '/').success(function(data) {
                alert('Update successfully');
            });
        }

    });