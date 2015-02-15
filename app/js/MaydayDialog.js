'use strict';

angular.module("ictApp")

    .factory('Maydays', [function () {
        return new Array();
    }])

    .controller('MaydayDlg', function($scope, DataStore, TbarSectors, Maydays, CreateNewMayday){

        $scope.incidentSectorTypes = [];
        $scope.incidentUnitTypes = [];
        $scope.selectedMayday;
        $scope.maydays = Maydays;

        $scope.showMaydayDlg = function () {

            $scope.refreshIncidentSectorTypes();
            $scope.refreshIncidentUnitTypes();

            // Create new Mayday object, if needed
            if(!$scope.selectedMayday) {
                var newMayday = CreateNewMayday(DataStore.incident);
                $scope.maydays.push(newMayday);
                $scope.selectedMayday = newMayday;
            }

            // Show the Mayday dialog
            $("#mayday_form").show();
        }

        $scope.closeMaydayDlg = function () {
            $("#mayday_form").hide();
        }

        $scope.addNewMayday = function () {
            var newMayday = CreateNewMayday(DataStore.incident);
            $scope.maydays.push(newMayday);
            $scope.selectedMayday = newMayday;
        }

        $scope.selectMayday = function (mayday) {
            $scope.selectedMayday = mayday;
        }

        $scope.manyValidSectorTypes = function () {
            var manyValidSectorTypes = 0;
            var sectorTypes = $scope.incidentSectorTypes;
            for(var s=0; s<sectorTypes.length; s++) {
                var sectorType = sectorTypes[s];
                if(sectorType.name != "Sector Name") {
                    manyValidSectorTypes++;
                }
            }//for
            return manyValidSectorTypes;
        }

        $scope.refreshIncidentSectorTypes = function () {
            $scope.incidentSectorTypes = [];
            var sectorTypesMap = {};
            for(var s=0; s<TbarSectors.length; s++) {
                var sector = TbarSectors[s];
                sectorTypesMap[sector.sectorType.name] = sector.sectorType;
            }//for
            var sectorTypeNames = Object.keys(sectorTypesMap);
            sectorTypeNames.sort();
            for(var u=0; u<sectorTypeNames.length; u++) {
                var sectorTypeName = sectorTypeNames[u];
                var sectorType = sectorTypesMap[sectorTypeName];
                if(sectorType.name != "Sector Name") {
                    $scope.incidentSectorTypes.push(sectorType);
                }
            }
        }// refreshIncidentSectorTypes


        $scope.refreshIncidentUnitTypes = function () {
            $scope.incidentUnitTypes = [];
            var unitsMap = {};
            for(var s=0; s<TbarSectors.length; s++) {
                var sector = TbarSectors[s];
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
                var unitName = unitNames[u];
                var unit = unitsMap[unitName];
                var unitType = unit.type;
                $scope.incidentUnitTypes.push(unitType);
            }
        }// refreshIncidentUnitTypes()

    })

    .factory('GetNextMaydayId', ['Maydays', function (Maydays) {
        return function () {
            return Maydays.length+1;
        }
    }])

    .factory('CreateNewMayday', ['ConvertParseObject', 'GetNextMaydayId', function (ConvertParseObject, GetNextMaydayId) {
        return function (incident) {
            var MaydayParseObj = Parse.Object.extend('Mayday');
            var newMayday = new MaydayParseObj();
            ConvertParseObject(newMayday, MAYDAY_DEF);
            newMayday.incident          = incident;
            newMayday.number            = GetNextMaydayId();
            newMayday.unitType          = {};
            newMayday.sectorType        = {};
            newMayday.isOnHoseline      = true;
            newMayday.isUnInjured       = true;
            newMayday.isLost            = false;
            newMayday.isTrapped         = false;
            newMayday.isOutOfAir        = false;
            newMayday.isRegulatorIssue  = false;
            newMayday.isLowAir          = false;
            newMayday.isPackIssue       = false;
            newMayday.nameFFighter      = "";
            newMayday.psi               = 4000;
            newMayday.channel           = "";
            newMayday.rank              = "";
            newMayday.save();
            return newMayday;
        }
    }])

;
