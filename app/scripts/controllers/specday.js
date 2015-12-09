'use strict';
angular.module("RecSystemWebApp")
.controller("SpecdayCtrl", function ($scope, $http, $location) {
    $scope.selectionItems = [{
        name: '0204',
        value: '10 February (World Cancer Day)'
    }, {
        name: '0911',
        value: '11 September (Terror)'
    }, {
        name: '1210',
        value: '10 December (Nobel prize)'
    }];

    $scope.selectedItem = $scope.selectionItems[0];
    $http.get('http://127.0.0.1:8888/special_day/' + $scope.selectedItem.name).success(function(data) {
            $scope.recMovies = data;
        });

    $scope.selectItem = function(selectedItem) {
        console.log($scope.selectedItem);
        $http.get('http://127.0.0.1:8888/special_day/' + $scope.selectedItem.name).success(function(data) {
            $scope.recMovies = data;
        });
    }
});