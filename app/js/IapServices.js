'use strict';

angular.module('IapServices', ['DataServices'])

    .controller('IapDlg', function($scope, DataStore){
        $scope.dataStore = DataStore;
        DataStore.showIapDlg = function() {
            $("#iap_dlg").dialog( "open" );
        }
        $scope.showIapDlg = function() {
            DataStore.showIapDlg();
        }
        //$scope.updateIapData = function() {
        //DataStore.iap.save();
        //}
    })

    .factory('LoadIAPForIncident', ['DataStore', 'Iap',
        function (DataStore, Iap) {
        return function (incident) {
            console.log("check 3 incident:", incident);
            return Iap.findAll().then(
                function(iapObjects){
                    console.log("check 3.1 iapObjects:", iapObjects);
                    for(var i=0; i<iapObjects.length; i++) {
                        var iap = iapObjects[i];
                    }
                    DataStore.iap = iapObject;
                    return incident;
                },
                function(error){
                    console.log("LoadIAPForIncident - IncidentType findAll error:", error);
                }
            );
           //var queryIap = new Parse.Query(Parse.Object.extend('Iap'));
           //queryIap.equalTo("incident", incident);
           // ParseQuery(queryIap, {functionToCall:'first'}).then(function(iapObject){
           //     if (iapObject){
           //         ConvertParseObject(iapObject, IAP_DEF);
           //         DataStore.iap = iapObject;
           //     } else {
           //         DataStore.iap = CreateNewIap(incident);
           //     }
           // });
        }
    }])

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
