
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

    .factory('LoadIncident',
        function ($q, ConvertParseObject, FetchTypeForIncident, DataStore, LoadAllMaydaysForIncident, LoadSectorsForIncident, LoadIAPForIncident, LoadObjectivesForIncident, LoadOSRForIncident, LoadUpgradeForIncident, LoadDispatchedUnitsForIncident) {
        return function (incidentObjectId) {

            var queryIncident = new Parse.Query(Parse.Object.extend('Incident'));
            queryIncident.equalTo("objectId", incidentObjectId);
            queryIncident.include('incidentType');
            return queryIncident.first().then(
                function(incident){
                    var promises = [];
                    if(incident) {
                        ConvertParseObject(incident, INCIDENT_DEF);
                        promises.push(LoadSectorsForIncident(incident));
                        promises.push(FetchTypeForIncident(incident));
                        //promises.push(LoadIAPForIncident_A(incident));
                    }
                    console.log("End of queryIncident.first()");
                    return $q.all(promises);
                },
                function(error) {
                    console.log('Failed to LoadIncident, with error code: ' + error.message);
                }
            );


            //var p = new Promise(
            //    function(resolve, reject) {
            //        window.setTimeout(function() {console.log("LoadIncident Promise p1"); resolve(incidentObjectId);}, 3000);
            //    }
            //);
            //return p;

            //var queryIncident = new Parse.Query(Parse.Object.extend('Incident'));
            //queryIncident.equalTo("objectId", incidentObjectId);
            //queryIncident.include('incidentType');
            //return queryIncident.first({
            //    success: function(incident) {
            //        var promises = [];
            //        if(incident) {
            //            ConvertParseObject(incident, INCIDENT_DEF);
            //            DataStore.incident = incident;
            //            //promises.push(DataStore.incident.incidentType.fetch().then(function(incidentTypeObj){
            //            //    ConvertParseObject(incidentTypeObj, INCIDENT_TYPE_DEF);
            //            //    DataStore.incident.inc_type_obj= incidentTypeObj;
            //            //}));
            //
            //            promises.push(LoadSectorsForIncident(incident));
            //            //promises.push(LoadAllMaydaysForIncident(incident));
            //            //promises.push(LoadIAPForIncident(incident));
            //            //promises.push(LoadObjectivesForIncident(incident));
            //            //promises.push(LoadOSRForIncident(incident));
            //            //promises.push(LoadUpgradeForIncident(incident));
            //            //promises.push(LoadDispatchedUnitsForIncident(incident));
            //        }
            //        console.log("End of LoadIncident queryIncident.first()");
            //        return $q.all(promises);
            //    },
            //    error: function(error) {
            //        console.log('Failed to LoadIncident, with error code: ' + error.message);
            //    }
            //});
        }
    })

    .factory('FetchTypeForIncident', function (ConvertParseObject) {
        return function (incident) {
            return incident.incidentType.fetch().then(function(type) {
                ConvertParseObject(type, INCIDENT_TYPE_DEF);
                incident.incidentType = type;
                console.log("End of FetchTypeForIncident");
                return incident;
            });
        }
    })

    .factory('Incidents', function() {
        return new Array();
    })

    .factory('LoadAllIncidents', ['ConvertParseObject', 'ParseQuery', 'Incidents', 'DataStore', function (ConvertParseObject, ParseQuery, Incidents, DataStore) {
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
                    setTimeout(function(){
                        console.log("DONE");
                        DataStore.loadSuccess = true;
                        DataStore.waitingToLoad = false;
                        $scope.$apply();
                    }, 1500);
                },
                error: function(error) {
                    console.log('Failed to LoadAllIncidents, with error code: ' + error.message);
                }
            });
        }
    }])


    .factory('LoadDispatchedUnitsForIncident', function ($q, ConvertParseObject, DataStore) {
        return function (incident) {
            var queryDispatchedUnits = new Parse.Query(Parse.Object.extend('DispatchedUnits'));
            queryDispatchedUnits.equalTo("incident", incident);
            return queryDispatchedUnits.first().then(
                function(dispatchedUnitsObj) {
                    if(!dispatchedUnitsObj) {
                        var DispatchedUnitsObj = Parse.Object.extend('DispatchedUnits');
                        dispatchedUnitsObj = new DispatchedUnitsObj();
                        ConvertParseObject(dispatchedUnitsObj , DISPATCHED_UNITS_DEF);
                        dispatchedUnitsObj.incident = incident;
                        dispatchedUnitsObj.unitTypes = new Array();
                        DataStore.dispatchedUnits = dispatchedUnitsObj;
                        return dispatchedUnitsObj.save(null, {
                            error: function(error) {
                                console.log('(2) Failed to save dispatechedUnitsObj with error code: ' + error.message);
                            }
                        });
                    } else {
                        var deferred = $q.defer();
                        var promises = [];
                        ConvertParseObject(dispatchedUnitsObj , DISPATCHED_UNITS_DEF);
                        DataStore.dispatchedUnits = dispatchedUnitsObj;
                        for(var i=0; i<dispatchedUnitsObj.unitTypes.length; i++) {
                            var unitType = dispatchedUnitsObj.unitTypes[i];
                            ConvertParseObject(unitType, UNIT_TYPE_DEF);
                            promises.push(unitType.fetch());
                        }
                        $q.all(promises)
                            .then(
                            function(results) {
                                deferred.resolve(results);
                            },
                            function(errors) {
                                deferred.reject(errors);
                            },
                            function(updates) {
                                deferred.update(updates);
                            });
                        return deferred.promise;
                    }
                },
                function(error) {
                    console.log('Failed to LoadDispatchedUnitsForIncident, with error code: ' + error.message);
                }
            );
        }
    })

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

