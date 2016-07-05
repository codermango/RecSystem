'use strict';

angular.module('RecSystemWebApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'chart.js',
    'infinite-scroll',
    'config'
])
.config(function ($routeProvider) {
    $routeProvider
        .when('/similar/:movieid/:recnum', {
            templateUrl: 'views/similar.html',
            controller: 'SimilarCtrl'
        })
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        })
        .when('/specday/', {
            templateUrl: 'views/specday.html',
            controller: 'SpecdayCtrl'
        })
        .when('/theme/', {
            templateUrl: 'views/theme.html',
            controller: 'ThemeCtrl'
        })
        .when('/userbase/', {
            templateUrl: 'views/userbase.html',
            controller: 'UserbaseCtrl'
        })
        .when('/svd/', {
            templateUrl: 'views/svd.html',
            controller: 'SVDCtrl'
        })
        .when('/credit/:movieid', {
            templateUrl: 'views/credit.html',
            controller: 'CreditCtrl'
        })
        .when('/credit/', {
            templateUrl: 'views/creditmovies.html',
            controller: 'CreditMoviesCtrl'
        })
        // .when('/userbase/:userid/:recnum', {
        //     templateUrl: 'views/userbase.html',
        //     controller: 'UserbaseCtrl'
        // })
        // .when('/specday/:day', {
        //     templateUrl: 'views/specday.html',
        //     controller: 'SpecdayCtrl'
        // })
        .otherwise({
            redirectTo: '/'
        });
});
