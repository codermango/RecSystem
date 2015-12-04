'use strict';

angular.module('RecSystemWebApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
])
.config(function ($routeProvider) {
    $routeProvider
        .when('/similar/:movieid', {
            templateUrl: 'views/similar.html',
            controller: 'SimilarCtrl'
        })
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});
