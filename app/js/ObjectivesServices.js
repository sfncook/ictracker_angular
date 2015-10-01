'use strict';

angular.module('ObjectivesServices', ['ParseServices', 'DataServices'])

    .controller('ObjDlg', function($scope, DataStore){
        $scope.dataStore = DataStore;
        DataStore.showObjectivesDlg = function() {
            $("#objectives_dlg").dialog( "open" );
        }
        $scope.showObjectivesDlg = function() {
            DataStore.showObjectivesDlg();
        }
        DataStore.updateObjPerc = function() {
            var fullAmt=11.0;
            var amtChecked=0;
            if (DataStore.objectives.upgradeToFullRescue){ amtChecked++; }
            if (DataStore.objectives.assingSafety){ amtChecked++; }
            if (DataStore.objectives.establishSupplyLine){ amtChecked++; }
            if (DataStore.objectives.secureUtilities){ amtChecked++; }
            if (DataStore.objectives.ventiliation){ amtChecked++; }
            if (DataStore.objectives.createOnDeck){ amtChecked++; }
            if (DataStore.objectives.pressurizeExposures){ amtChecked++; }
            if (DataStore.objectives.monitorChannel16){ amtChecked++; }
            if (DataStore.objectives.salvage){ amtChecked++; }
            if (DataStore.objectives.establishRehab){ amtChecked++; }
            if (DataStore.objectives.customerService){ amtChecked++; }
            angular.element('#objectives_perc_bar').css('width', ((amtChecked*100.0)/fullAmt) + '%');
        }
        $scope.updateObjPerc = function() {
            DataStore.updateObjPerc();
        }
    })

    .factory('LoadObjectivesForIncident', function (ConvertParseObject, DataStore, CreateNewObjectives) {
        return function ($scope, incident) {
            var queryObjectives = new Parse.Query(Parse.Object.extend('Objectives'));
            queryObjectives.equalTo("incident", incident);
            return queryObjectives.first().then(
                function(objectivesObject){
                    if (objectivesObject){
                        ConvertParseObject(objectivesObject, OBJECTIVES_DEF);
                        DataStore.objectives = objectivesObject;
                    } else {
                        DataStore.objectives = CreateNewObjectives(incident);
                    }
                    DataStore.updateObjPerc();
                }
            );
        }
    })

    .factory('CreateNewObjectives', ['ConvertParseObject', 'DataStore', function (ConvertParseObject, DataStore) {
        return function (curIncident) {
            var ObjectivesParseObj = Parse.Object.extend('Objectives');
            var objectivesObject = new ObjectivesParseObj();
            ConvertParseObject(objectivesObject, OBJECTIVES_DEF);
            objectivesObject.upgradeToFullRescue = false;
            objectivesObject.assingSafety = false;
            objectivesObject.establishSupplyLine = false;
            objectivesObject.secureUtilities = false;
            objectivesObject.ventiliation = false;
            objectivesObject.createOnDeck = false;
            objectivesObject.pressurizeExposures = false;
            objectivesObject.monitorChannel16 = false;
            objectivesObject.salvage = false;
            objectivesObject.establishRehab = false;
            objectivesObject.customerService = false;
            objectivesObject.incident=curIncident;
            return objectivesObject;
        }
    }])

;
