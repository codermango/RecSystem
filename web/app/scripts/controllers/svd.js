'use strict';
angular.module("RecSystemWebApp")
.controller("SVDCtrl", function ($scope, $http, $location, ENV) {
    $scope.server = ENV.server;
    let svdRec = {};

    $http.get('../../data/svd/result.json').then(function(data) {
        svdRec = data['data'];
    }, function(data) {
        $scope.errorMsg = "Sorry, something is wrong! " + data;
    });

    $scope.recommend = function(userid) {
        if (userid == undefined || userid.trim() == '' ) {
            var inputErrorDialog = $("#inputErrorDialog").data('dialog');
            if (!inputErrorDialog.element.data('opened')) {
                inputErrorDialog.open();
            } else {
                inputErrorDialog.close();
            }
            return;
        } else {
            $scope.recMovies = svdRec[userid]['rec'];
            $scope.likedMovies = svdRec[userid]['history_list'];
            console.log($scope.recMovies);
            console.log($scope.likedMovies);
        }
        // $location.path('/userbase/' + userid + '/' + recNum + '/');
    };
});