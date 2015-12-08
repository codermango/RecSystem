'use strict';
angular.module("RecSystemWebApp")
.controller("SpecdayCtrl", function ($scope, $http, $location) {
    $scope.selectionItems = [{
        name: '0801',
        value: '1 August (Pride parade)'
    }, {
        name: '0911',
        value: '11 September (Terror)'
    }, {
        name: '1210',
        value: '10 December (Nobel prize)'
    }];

    $scope.selectedItem = $scope.selectionItems[0];

    $scope.selectItem = function(selectedItem) {
        console.log($scope.selectedItem);

    }
});