'use strict';
angular.module("RecSystemWebApp")
.controller("PieCtrl", function ($scope) {
    $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
    $scope.data = [20, 500, 100];
});