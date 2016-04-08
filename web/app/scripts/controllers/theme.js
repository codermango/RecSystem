'use strict';

angular.module('RecSystemWebApp')
    .controller('ThemeCtrl', function ($scope, $http, ENV) {
        $scope.server = ENV.server;
        $scope.search = function(word) {

            if (word == undefined || word.trim() == '' ) {
                var inputErrorDialog = $("#inputErrorDialog").data('dialog');
                if (!inputErrorDialog.element.data('opened')) {
                    inputErrorDialog.open();
                } else {
                    inputErrorDialog.close();
                }
                return;
            }
            

            console.log(word);
            var url = $scope.server + '/theme/' + word + '/';

            $http.get(url).then(function(data) {
                console.log(data.length);
                if (data.length == 0) {
                    $scope.themeword = "Nothing found!";
                    $scope.themes = null;
                    return;
                }
                $scope.themeword = word;
                $scope.themes = data;
            }, function(data) {
                $scope.themeword = "Sorry, database is not available currently!";
            });
            
        };

        $scope.go = function(ngnum, fromnum, tonum) {
            $scope.themeword = '';
            if (ngnum == undefined || fromnum == undefined || tonum == undefined || ngnum.trim() == '' || fromnum.trim() == '' || tonum.trim() == '') {
                var inputErrorDialog = $("#inputErrorDialog").data('dialog');
                if (!inputErrorDialog.element.data('opened')) {
                    inputErrorDialog.open();
                } else {
                    inputErrorDialog.close();
                }
                return;
            }

            $http.get($scope.server + '/theme/' + ngnum + '/' + fromnum + '/' + tonum + '/').then(function(data) {
                $scope.themes = data;
            }, function(data) {
                $scope.themeword = "Sorry, database is not available currently!";
            });

        }
    });