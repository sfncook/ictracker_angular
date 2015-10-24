'use strict';

angular.module('ObjectivesServices', ['ParseServices', 'DataServices'])

    .controller('ObjDlg', function($scope, DataStore, UpdateObjectivesPercent){
        $scope.dataStore = DataStore;
        DataStore.showObjectivesDlg = function() {
            $("#objectives_dlg").dialog( "open" );
        }
        $scope.showObjectivesDlg = function() {
            DataStore.showObjectivesDlg();
        }
    })

    .factory('UpdateObjectivesPercent', function () {
        return function (incident) {
            var fullAmt=11.0;
            var amtChecked=0;
            if(incident.objectives) {
                if (incident.objectives.upgradeToFullRescue){ amtChecked++; }
                if (incident.objectives.assingSafety){ amtChecked++; }
                if (incident.objectives.establishSupplyLine){ amtChecked++; }
                if (incident.objectives.secureUtilities){ amtChecked++; }
                if (incident.objectives.ventiliation){ amtChecked++; }
                if (incident.objectives.createOnDeck){ amtChecked++; }
                if (incident.objectives.pressurizeExposures){ amtChecked++; }
                if (incident.objectives.monitorChannel16){ amtChecked++; }
                if (incident.objectives.salvage){ amtChecked++; }
                if (incident.objectives.establishRehab){ amtChecked++; }
                if (incident.objectives.customerService){ amtChecked++; }
                angular.element('#objectives_perc_bar').css('width', ((amtChecked*100.0)/fullAmt) + '%');
            }
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
