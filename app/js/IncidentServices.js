
angular.module('IncidentServices', ['ParseServices', 'DataServices', 'IapServices', 'ObjectivesServices', 'OSRServices', 'UpgradeServices'])

    .factory('IncidentTypes', function() {
        return new Array();
    })

    .controller('StrategyDlg', function($scope, $http, DataStore){
        $scope.dataStore = DataStore;
        DataStore.showStrategyDlg=function(){
            $("#strategy_dlg").dialog('open');
        }
        $scope.setStrategy = function(strategyType){
            DataStore.incident.strategy = strategyType;
            DataStore.incident.save();
            $("#strategy_dlg").dialog('close');
        }
    })

    .factory('LoadIncident', function (AdapterStore) {
        return function (incidentObjectId) {
            return AdapterStore.adapter.LoadIncident(incidentObjectId);
        }
    })
    .factory('LoadAllIncidents', function (AdapterStore) {
        return function () {
            return AdapterStore.adapter.LoadAllIncidents();
        }
    })
    .factory('LoadIncidentTypes', function (AdapterStore) {
        return function () {
            return AdapterStore.adapter.LoadIncidentTypes();
        }
    })

    .factory('UpdateIncidentAsNeeded', function (AdapterStore) {
        return function (incidentObjectId) {
            return AdapterStore.adapter.UpdateIncidentAsNeeded();
        }
    })

    .factory('Incidents', function() {
        return new Array();
    })

    .factory('SaveIncident', function (AdapterStore) {
        return function (incident) {
            return AdapterStore.adapter.SaveIncident(incident);
        }
    })

    .filter('sortIncTypeByOrder', function(){
        return function(array) {
            if(array) {
                array.sort(function(a, b){
                    return a.order - b.order;
                });
            }
            return array;
        }
    })

;


