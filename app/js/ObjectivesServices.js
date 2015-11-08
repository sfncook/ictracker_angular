'use strict';

angular.module('ObjectivesServices', ['DataServices'])

    .controller('ObjDlg', function($scope, DataStore, UpdateObjectivesPercent){
        $scope.dataStore = DataStore;
        DataStore.showObjectivesDlg = function() {
            $("#objectives_dlg").dialog( "open" );
        }
        $scope.showObjectivesDlg = function() {
            DataStore.showObjectivesDlg();
        }
        $scope.updateObjPerc = function() {
            UpdateObjectivesPercent(DataStore.incident);
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

;
