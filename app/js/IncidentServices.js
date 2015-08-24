
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

    .factory('LoadIncidentTypes', ['IncidentTypes', 'ParseQuery', 'ConvertParseObject', function (IncidentTypes, ParseQuery, ConvertParseObject) {
        return function () {
            var queryIncidentTypes = new Parse.Query(Parse.Object.extend('IncidentType'));
            return queryIncidentTypes.find({
                success: function(incidentTypes) {
                    for(var i=0; i<incidentTypes.length; i++) {
                        var incidentType = incidentTypes[i];
                        ConvertParseObject(incidentType, INCIDENT_TYPE_DEF);
                        IncidentTypes.push(incidentType);
                        var nameRefor = incidentType.nameShort.toUpperCase();
                        IncidentTypes[nameRefor] = incidentType;
                    }
                },
                error: function(error) {
                    console.log('Failed to LoadIncidentTypes, with error code: ' + error.message);
                }
            });
        }
    }])

    .factory('LoadIncident', [
        'ConvertParseObject', 'ParseQuery', 'DataStore', 'LoadAllMaydaysForIncident', 'LoadSectorsForIncident', 'LoadIAPForIncident', 'LoadObjectivesForIncident', 'LoadOSRForIncident', 'LoadUpgradeForIncident',
        function (ConvertParseObject, ParseQuery, DataStore, LoadAllMaydaysForIncident, LoadSectorsForIncident, LoadIAPForIncident, LoadObjectivesForIncident, LoadOSRForIncident, LoadUpgradeForIncident) {
        return function (incidentObjectId, $scope) {
            var queryIncident = new Parse.Query(Parse.Object.extend('Incident'));
            queryIncident.equalTo("objectId", incidentObjectId);
            queryIncident.include('incidentType');
            queryIncident.first({
                success: function(incident) {
                    if(incident) {
                        ConvertParseObject(incident, INCIDENT_DEF);
                        DataStore.incident = incident;
                        DataStore.incident.incidentType.fetch().then(function(incidentTypeObj){
                            ConvertParseObject(incidentTypeObj, INCIDENT_TYPE_DEF);
                            DataStore.incident.inc_type_obj= incidentTypeObj;
                        });

                        LoadSectorsForIncident($scope, incident);
                        LoadAllMaydaysForIncident($scope, incident);
                        LoadIAPForIncident($scope, incident);
                        LoadObjectivesForIncident($scope, incident);
                        LoadOSRForIncident($scope, incident);
                        LoadUpgradeForIncident($scope, incident);

                        setTimeout(function(){
                            DataStore.loadSuccess = true;
                            DataStore.waitingToLoad = false;
                            $scope.$apply();
                        }, 3500);

                    } else {
                        DataStore.loadSuccess = false;
                        DataStore.waitingToLoad = false;
                    }
                },
                error: function(error) {
                    console.log('Failed to LoadIncident, with error code: ' + error.message);
                }
            });
        }
    }])

    .factory('Incidents', function() {
        return new Array();
    })

    .factory('LoadAllIncidents', ['ConvertParseObject', 'ParseQuery', 'Incidents', function (ConvertParseObject, ParseQuery, Incidents) {
        return function ($scope) {
            Incidents.removeAll();
            var query = new Parse.Query(Parse.Object.extend('Incident'));
            return query.find({
                success: function(incidents) {
                    for(var i=0; i<incidents.length; i++) {
                        var incident = incidents[i];
                        ConvertParseObject(incident, INCIDENT_DEF);
                        fetchTypeForIncident(incident, $scope, ConvertParseObject);
                        Incidents.push(incident);
                    }
                },
                error: function(error) {
                    console.log('Failed to LoadAllIncidents, with error code: ' + error.message);
                }
            });
        }
    }])

;

function fetchTypeForIncident(incident, $scope, ConvertParseObject) {
    var type = incident.incidentType;
    if(type) {
        type.fetch({
            success: function(type) {
                $scope.$apply(function(){
                    ConvertParseObject(type, INCIDENT_TYPE_DEF);
                    incident.incidentType = type;
                });
            },
            error: function(error) {
                console.log('Failed to fetchTypeForIncident, with error code: ' + error.message);
            }
        });
    }
}

