'use strict';

angular.module("ictApp")

    .controller('MaydayDlg', function($scope, DataStore, TbarSectors, CreateNewMayday){

        $scope.dataStore = DataStore;
        $scope.tbarSectors = TbarSectors;
        $scope.incidentUnits = [];
        $scope.selectedMayday;
        $scope.maydays = new Array();

        $scope.showMaydayDlg = function () {

            // Update the list of units. - This should be a unique list of unitTypes along and they should be sorted
            $scope.incidentUnits = [];
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
            for(var u=0; u<unitNames.length; u++) {
                $scope.incidentUnits.push(unitNames[u]);
            }

            // Create new Mayday object, if needed
            if(!$scope.selectedMayday) {
                var newMayday = CreateNewMayday($scope.dataStore.incident);
                $scope.maydays.push(newMayday);
                $scope.selectedMayday = newMayday;
            }

            // Show the Mayday dialog
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

    })

    .factory('CreateNewMayday', ['ConvertParseObject', function (ConvertParseObject) {
        return function (incident) {
            var MaydayParseObj = Parse.Object.extend('Mayday');
            var newMayday = new MaydayParseObj();
            ConvertParseObject(newMayday, MAYDAY_DEF);
            newMayday.incident          = incident;
            //newMayday.number          = ;
            //newMayday.unitType        = ;
            //newMayday.sectorType      = ;
            newMayday.isOnHoseline      = true;
            newMayday.isUnInjured       = true;
            newMayday.isLost            = false;
            newMayday.isTrapped         = false;
            newMayday.isOutOfAir        = false;
            newMayday.isRegulatorIssue  = false;
            newMayday.isLowAir          = false;
            newMayday.isPackIssue       = false;
            newMayday.nameFFighter      = "XXXYYYZZZ";
            newMayday.psi               = 4000;
            newMayday.channel           = "";
            newMayday.rank              = "";
            newMayday.save();
            return newMayday;
        }
    }])

;
