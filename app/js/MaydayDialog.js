'use strict';

angular.module("ictApp")

    .controller('MaydayDlg', function($scope, TbarSectors){

        $scope.tbarSectors = TbarSectors;

        $scope.showMaydayDlg = function () {
            $scope.test = "testing";

            $scope.incidentUnits = new Array();

            for(var s=0; s<$scope.tbarSectors.length; s++) {
                var sector = $scope.tbarSectors[s];
                for(var u=0; u<sector.units.length; u++) {
                    var unit = sector.units[u];
                    $scope.incidentUnits.push(unit);
                }
            }

            $("#mayday_form").show();
        }

        $scope.closeMaydayDlg = function () {
            $("#mayday_form").hide();
        }
    })

;
