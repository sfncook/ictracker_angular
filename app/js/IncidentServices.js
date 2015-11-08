
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

    .factory('FetchTypeForIncident', function (ConvertParseObject) {
        return function (incident) {
            return incident.incidentType.fetch().then(
                function(type) {
                    ConvertParseObject(type, INCIDENT_TYPE_DEF);
                    incident.incidentType = type;
                    return type;
                },
                function(error) {
                    console.log('Failed to FetchTypeForIncident, with error code: ' + error.message);
                }
            );
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


