'use strict';

angular.module("ictApp")

    .factory('Maydays', [function () {
        return new Array();
    }])

    .controller('MaydayDlg', function($scope, TbarSectors, Maydays, CreateNewMayday, SaveAllMaydays){

        $scope.incidentSectorTypes = [];
        $scope.incidentUnitTypes = [];
        $scope.selectedMayday;
        $scope.maydays = Maydays;

        $scope.showMaydayDlg = function () {

            $scope.refreshIncidentSectorTypes();
            $scope.refreshIncidentUnitTypes();

            // Create new Mayday object, if needed
            if($scope.maydays.length==0) {
                var newMayday = CreateNewMayday();
                $scope.maydays.push(newMayday);
            }
            if(!$scope.selectedMayday) {
                $scope.selectedMayday = $scope.maydays[0];
            }

            // Show the Mayday dialog
            $("#mayday_form").show();
        }

        $scope.closeMaydayDlg = function () {
            SaveAllMaydays();
            $("#mayday_form").hide();
        }

        $scope.addNewMayday = function () {
            var newMayday = CreateNewMayday();
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

    .factory('CreateNewMayday', ['ConvertParseObject', 'GetNextMaydayId', 'DataStore', function (ConvertParseObject, GetNextMaydayId, DataStore) {
        return function () {
            var MaydayParseObj = Parse.Object.extend('Mayday');
            var newMayday = new MaydayParseObj();
            ConvertParseObject(newMayday, MAYDAY_DEF);
            newMayday.incident          = DataStore.incident;
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
            return newMayday;
        }
    }])

    .factory('SaveAllMaydays', ['Maydays', function (Maydays) {
        return function () {
            for(var m=0; m<Maydays.length; m++) {
                var mayday = Maydays[m];
                mayday.save();
            }
        }
    }])

    .factory('LoadAllMaydays', [
        'Maydays', 'DataStore', 'ParseQuery', 'ConvertParseObject', 'FetchUnitTypeForMayday', 'FetchSectorTypeForMayday',
        function (Maydays, DataStore, ParseQuery, ConvertParseObject, FetchUnitTypeForMayday, FetchSectorTypeForMayday) {
        return function ($scope) {
            var queryMaydays = new Parse.Query(Parse.Object.extend('Mayday'));
            queryMaydays.equalTo("incident", DataStore.incident);
            queryMaydays.include('unitType');
            queryMaydays.include('sectorType');
            ParseQuery(queryMaydays, {functionToCall:'find'}).then(function(maydays){
                for(var i=0; i<maydays.length; i++) {
                    var mayday = maydays[i];
                    ConvertParseObject(mayday, MAYDAY_DEF);
                    Maydays.push(mayday);
                    FetchUnitTypeForMayday($scope, mayday);
                    FetchSectorTypeForMayday($scope, mayday);
                }
            });
        }
    }])

    .factory('FetchUnitTypeForMayday', ['ConvertParseObject', function (ConvertParseObject) {
        return function ($scope, mayday) {
            if(mayday.unitType) {
                mayday.unitType.fetch({
                    success: function(unitType) {
                        $scope.$apply(function(){
                            ConvertParseObject(unitType, UNIT_TYPE_DEF);
                            mayday.unitType = unitType;
                        });
                    }
                });
            }
        }
    }])

    .factory('FetchSectorTypeForMayday', ['ConvertParseObject', function (ConvertParseObject) {
        return function ($scope, mayday) {
            if(mayday.sectorType) {
                mayday.sectorType.fetch({
                    success: function(sectorType) {
                        $scope.$apply(function(){
                            ConvertParseObject(sectorType, SECTOR_TYPE_DEF);
                            mayday.sectorType = sectorType;
                        });
                    }
                });
            }
        }
    }])

;
