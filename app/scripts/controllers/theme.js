'use strict';

angular.module('RecSystemWebApp')
    .controller('ThemeCtrl', function ($scope, $http) {
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
            var url = 'http://192.168.1.80:8888/theme/' + word + '/';

            $http.get(url).success(function(data) {
                console.log(data.length);
                if (data.length == 0) {
                    $scope.themeword = "Nothing found!";
                    $scope.themes = null;
                    return;
                }
                $scope.themeword = word;
                $scope.themes = data;
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

            $http.get('http://192.168.1.80:8888/theme/' + ngnum + '/' + fromnum + '/' + tonum + '/').success(function(data) {
                $scope.themes = data;
            });

        }
    });