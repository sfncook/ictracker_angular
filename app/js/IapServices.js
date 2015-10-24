'use strict';

angular.module('IapServices', ['ParseServices', 'DataServices'])

    .controller('IapDlg', function($scope, DataStore){
        $scope.dataStore = DataStore;
        DataStore.showIapDlg = function() {
            $("#iap_dlg").dialog( "open" );
        }
        $scope.showIapDlg = function() {
            DataStore.showIapDlg();
        }
        $scope.updateIapData = function() {
        	DataStore.iap.save();
        }
    })

    .factory('LoadIAPForIncident', function (ConvertParseObject, DataStore, CreateNewIap) {
        return function (incident) {
            var queryIap = new Parse.Query(Parse.Object.extend('Iap'));
            queryIap.equalTo("incident", incident);
            queryIap.equalTo("incident", incident);
            return queryIap.first().then(
                function(iapObject){
                    if (iapObject){
                        ConvertParseObject(iapObject, IAP_DEF);
                        DataStore.iap = iapObject;
                    } else {
                        DataStore.iap = CreateNewIap(incident);
                    }
                }
            );
        }
    })

    .factory('CreateNewIap', ['ConvertParseObject', 'DataStore', function (ConvertParseObject, DataStore) {
        return function (curIncident) {
            var IapParseObj = Parse.Object.extend('Iap');
            var iapObject = new IapParseObj();
            ConvertParseObject(iapObject, IAP_DEF);
            iapObject.isActionEffect=false;
            iapObject.isArrangement=false;
            iapObject.isBuilding=false;
            iapObject.isFire=false;
            iapObject.isLifeHazard=false;
            iapObject.isOccupancy=false;
            iapObject.isResources=false;
            iapObject.isSpecial=false;
            iapObject.isSprinkler=false;
            iapObject.isVent=false;
            iapObject.fireControl="";
            iapObject.firefighterSafety="";
            iapObject.propertyPeople="";
            iapObject.evacuationLocation="";
            iapObject.rescue="";
            iapObject.incident=curIncident;
            return iapObject;
        }
    }])

;
