'use strict';

angular.module('RecSystemWebApp')
    .controller('CreditCtrl', function ($scope, $http, $routeParams, ENV) {
        $scope.server = ENV.server;
        $scope.frameImages = [];
        $scope.movieid = $routeParams.movieid;
        $http.get(ENV.server + '/credit/' + $scope.movieid + '/').success(function(data) {
            console.log(data);
            
            $scope.frameImages = data["frames"].sort().map(item => Number(item.split(".")[0]));
            $scope.movieid = data["movieid"];
            $scope.startSec = Number(data["start_seconds"]);
            $scope.endSec = Number(data["end_seconds"]);
        });

        $scope.updateCredit = function(movieid, startSec, endSec, isUpdated) {
            if (isUpdated) {
                if (isNaN(startSec) && isNaN(endSec)) {
                    alert('Please input number!');
                    return;
                } else if (Number(startSec) >= Number(endSec)) {
                    alert('start seconds should be smaller than end seconds!');
                    return;
                }

            }
            $http.get(ENV.server + '/credit/' + movieid + '/' + startSec + '/' + endSec + '/' + isUpdated + '/').success(function(data) {
                alert('Update successfully');
            });
        }

        let selectedCredits = [];
        let selectedEles = []
        $scope.selectCredits = function(image, e) {
            selectedCredits.push(image);
            let selectedEle = $(e.currentTarget).parent();
            selectedEles.push(selectedEle);

            if (selectedCredits.length === 1) {
                selectedEle.addClass("highlight-start");
            }

            if (selectedCredits.length === 2) {
                if (image <= selectedCredits[0]) {
                    alert("End credit should greater than start credit!");
                    selectedEles.pop();
                    selectedCredits.pop();
                    selectedEle.removeClass("highlight-end");
                    return;
                }
                selectedEle.addClass("highlight-end");
                let r = confirm("Do you want to update the credits?");
                if (r == true) {
                    // update the database
                    $http.get(ENV.server + '/credit/' + $scope.movieid + '/' + selectedCredits[0] + '/' + selectedCredits[1] + '/true/').success(function(data) {
                        selectedCredits = [];
                        alert('Update successfully');
                        selectedEles[0].removeClass("highlight-start");
                        selectedEles[1].removeClass("highlight-end");
                        selectedEles = [];
                    });

                } else {
                    selectedCredits = [];
                    selectedEles[0].removeClass("highlight-start");
                    selectedEles[1].removeClass("highlight-end");
                    selectedEles = [];
                }

            }

        }

    });