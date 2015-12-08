'use strict';

angular.module('RecSystemWebApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'chart.js'
])
.config(function ($routeProvider) {
    $routeProvider
        .when('/similar/:movieid/:recnum', {
            templateUrl: 'views/similar.html',
            controller: 'SimilarCtrl'
        })
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .when('/specday/', {
            templateUrl: 'views/specday.html',
            controller: 'SpecdayCtrl'
        })
        .when('/specday/:day', {
            templateUrl: 'views/specday.html',
            controller: 'SpecdayCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});
