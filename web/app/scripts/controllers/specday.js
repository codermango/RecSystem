'use strict';
angular.module("RecSystemWebApp")
.controller("SpecdayCtrl", function ($scope, $http, ENV) {
    $scope.server = ENV.server;


    $http.get($scope.server + '/holiday_keyword/').success(function(data) {
        $scope.selectionItems = [];
        for (var key in data) {
            $scope.selectionItems.push({name: key, value: key + ' ' + data[key]});
        }
        $scope.selectedItem = $scope.selectionItems[0];

        $http.get($scope.server + '/special_day/' + $scope.selectedItem.name + '/').success(function(data) {
            $scope.specdayMovies = data['specday_movies'];
        });
    });

    $scope.selectItem = function(selectedItem) {
        console.log($scope.selectedItem);
        $http.get($scope.server + '/special_day/' + $scope.selectedItem.name + '/').success(function(data) {
            $scope.specdayMovies = data['specday_movies'];
        });
    }
});