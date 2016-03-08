'use strict';

angular.module('RecSystemWebApp')
    .controller('SimilarCtrl', function ($scope, $http, $routeParams, $location) {
        $scope.movieID = $routeParams.movieid;
        $scope.recNum = $routeParams.recnum;

        $http.get('http://192.168.1.80:8888/rec/' + $scope.movieID + '/' + $scope.recNum + '/').success(function(data) {
            console.log(data);
            $scope.recMovies = data;

        });

        $scope.recommend = function(imdbid, recNum) {
            if (imdbid == undefined || imdbid.trim() == '' ) {
                var inputErrorDialog = $("#inputErrorDialog").data('dialog');
                if (!inputErrorDialog.element.data('opened')) {
                    inputErrorDialog.open();
                } else {
                    inputErrorDialog.close();
                }
                return;
            }
            $location.path('/similar/' + imdbid + '/' + recNum + '/');
        };


        $scope.showChart = function(e) {
            let feature_labels = [];
            let feature_values = [];
            for (let key in this.features) {
                if (key !== 'sum') {
                    feature_labels.push(key);
                    feature_values.push(this.features[key]);
                }
            }
            $scope.labels = feature_labels;
            $scope.data = [feature_values];

            // console.log($scope.labels);
            // console.log($scope.data);

            // get the position of current div
            let currentDiv = $("#div-" + this.movie);
            // console.log(currentDiv.offset());
            // console.log(currentDiv.width());

            Chart.defaults.global.tooltipFontColor = "#FA6800";
            Chart.defaults.global.tooltipFontSize = 58;
            let chartDiv = $("#reason-chart");

            chartDiv.css('display', 'block');
            let left = currentDiv.offset()['left'] + currentDiv.outerWidth() / 2 - chartDiv.outerWidth() / 2;
            let top = currentDiv.offset()['top'] - chartDiv.outerHeight();
            // console.log(left + " " + top); 
            // console.log(chartDiv.height());
            chartDiv.offset({ top: top, left: left });


        }

        $scope.hideChart = function() {
            $("#reason-chart").css('display', 'none');
        }

        // $scope.labels = ["genre", "actor"];
        // $scope.data = [
        //     [1.3199999999999998, 1.6]
        // ];


    });
