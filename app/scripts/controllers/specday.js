'use strict';
angular.module("RecSystemWebApp")
.controller("SpecdayCtrl", function ($scope, $http) {
    // $scope.selectionItems = [{
    //     name: '0204',
    //     value: '10 February (World Cancer Day)'
    // }, {
    //     name: '0911',
    //     value: '11 September (Terror)'
    // }, {
    //     name: '1210',
    //     value: '10 December (Nobel prize)'
    // }];

    $http.get('http://127.0.0.1:8888/holiday_keyword').success(function(data) {
        $scope.selectionItems = [];
        for (var key in data) {
            $scope.selectionItems.push({name: key, value: key + ' ' + data[key]});
        }
        $scope.selectedItem = $scope.selectionItems[0];
        $http.get('http://127.0.0.1:8888/special_day/' + $scope.selectedItem.name).success(function(data) {
            $scope.specdayMovies = data['specday_movies'];
        });
    });

    $scope.selectItem = function(selectedItem) {
        console.log($scope.selectedItem);
        $http.get('http://127.0.0.1:8888/special_day/' + $scope.selectedItem.name).success(function(data) {
            $scope.specdayMovies = data['specday_movies'];
        });
    }
});