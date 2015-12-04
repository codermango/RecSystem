'use strict';

angular.module('RecSystemWebApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
])
.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/similar.html',
            controller: 'SimilarCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});
