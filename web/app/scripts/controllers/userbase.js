'use strict';
angular.module("RecSystemWebApp")
.controller("UserbaseCtrl", function ($scope, $http, $location, ENV) {
    $scope.server = ENV.server;

    $scope.recommend = function(userid, recNum) {
        if (userid == undefined || userid.trim() == '' ) {
            var inputErrorDialog = $("#inputErrorDialog").data('dialog');
            if (!inputErrorDialog.element.data('opened')) {
                inputErrorDialog.open();
            } else {
                inputErrorDialog.close();
            }
            return;
        } else {
            $http.get($scope.server + '/user/' + userid + '/' + recNum + '/').then(function(data) {
                $scope.recMovies = data['data']['rec'];
                $scope.likedMovies = data['data']['liked_movies'];
                console.log($scope.recMovies);
            }, function(data) {
                $scope.errorMsg = "Sorry, something is wrong! " + data;
            });
        }
        // $location.path('/userbase/' + userid + '/' + recNum + '/');
    };
});