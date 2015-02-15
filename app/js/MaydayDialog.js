'use strict';

angular.module("ictApp")

    .controller('MaydayDlg', function($scope, TbarSectors){

        $scope.tbarSectors = TbarSectors;

        $scope.showMaydayDlg = function () {
            console.log('showMaydayDlg');

            $("#mayday_form").show();
        }

        $scope.closeMaydayDlg = function () {
            $("#mayday_form").hide();
        }

        $scope.manyValidTbars = function () {
            var manyValidTbars = 0;
            var sectors = $scope.tbarSectors;
            for(var s=0; s<sectors.length; s++) {
                var sector = sectors[s];
                if(sector.sectorType.name != "Sector Name") {
                    manyValidTbars++;
                }
            }//for
            return manyValidTbars;
        }

        $scope.incidentUnits = function () {
            console.log('incidentUnits');
            var unitsMap = {};
            for(var s=0; s<$scope.tbarSectors.length; s++) {
                var sector = $scope.tbarSectors[s];
                if(sector.units) {
                    for(var u=0; u<sector.units.length; u++) {
                        var unit = sector.units[u];
                        unitsMap[unit.type.name] = unit;
                    }
                }
            }//for

            var unitNames = Object.keys(unitsMap);
            unitNames.sort();
            var incidentUnits = [];
            for(var u=0; u<unitNames.length; u++) {
                var unit = unitsMap[unitNames[u]];
                incidentUnits.push(unit);
            }
            return incidentUnits;
        }
    })

;
