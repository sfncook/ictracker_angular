'use strict';

angular.module('OSRServices', ['ParseServices', 'DataServices'])

    .controller('OsrDlg', function($scope, DataStore, UpdateOsrPercent){
        $scope.dataStore = DataStore;
        DataStore.showOSRDlg = function() {
            $("#osr_dlg").dialog( "open" );
        }

        $scope.showOSRDlg = function() {
            DataStore.showOSRDlg();
        }

        $scope.updateOSRPerc = function() {
            UpdateOsrPercent(DataStore.incident);
        }

        $scope.showUnitsDlgForOsr = DataStore.showUnitsDlgForOsr;
    })

    .factory('UpdateOsrPercent', function () {
        return function (incident) {
            var fullAmt=9.0;
            var amtChecked=0;
            if(incident) {
                if (incident.osr.unit!=''){ amtChecked++; }
                if (incident.osr.dispatchAddress!=''){ amtChecked++; }
                if (incident.osr.conditions!=''){ amtChecked++; }
                if (incident.osr.isOccupancy){ amtChecked++; }
                if (incident.osr.isConstruction){ amtChecked++; }
                if (incident.osr.isAssumeCommand){ amtChecked++; }
                if (incident.osr.isAttackLine){ amtChecked++; }
                if (incident.osr.isWaterSupply){ amtChecked++; }
                if (incident.osr.accountability!=''){ amtChecked++; }
            }
            angular.element('#osr_perc_bar').css('width', ((amtChecked*100.0)/fullAmt) + '%');
        }
    })

    .factory('LoadOSRForIncident', function (ConvertParseObject, DataStore, CreateNewOSR) {
        return function (incident) {
            var queryOSR = new Parse.Query(Parse.Object.extend('OSR'));
            queryOSR.equalTo("incident", incident);
            return queryOSR.first().then(
                function(osrObject){
                    if (osrObject){
                        ConvertParseObject(osrObject, OSR_DEF);
                        DataStore.osr = osrObject;
                    } else {
                        DataStore.osr = CreateNewOSR(incident);
                    }
                    DataStore.updateOSRPerc();
                }
            );
        }
    })

    .factory('CreateNewOSR', ['ConvertParseObject', 'DataStore', function (ConvertParseObject, DataStore) {
        return function (curIncident) {
            var OSRParseObj = Parse.Object.extend('OSR');
            var osrObject = new OSRParseObj();
            ConvertParseObject(osrObject, OSR_DEF);
            osrObject.isAddress = false;
            osrObject.isOccupancy = false;
            osrObject.isConstruction = false;
            osrObject.isAssumeCommand = false;
            osrObject.isLocation = false;
            osrObject.isStrategy = false;
            osrObject.isAttackLine = false;
            osrObject.isWaterSupply = false;
            osrObject.isIRIC = false;
            osrObject.isBasement = false;
            osrObject.isMobile = false;
            osrObject.isDefensive = false;

            osrObject.accountability = '';
            osrObject.accountabilityLocation = '';
            osrObject.unit = '';
            osrObject.dispatchAddress = '';
            osrObject.sizeOfBuilding = '';
            osrObject.numberOfFloors = '';
            osrObject.typeOfBuilding = '';
            osrObject.subFloors = '';
            osrObject.constructionType = '';
            osrObject.roofType = '';
            osrObject.conditions = '';

            osrObject.incident=curIncident;
            return osrObject;
        }
    }])

;
