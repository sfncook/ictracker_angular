
angular.module('IncidentServices', ['DataModelsModule', 'DataServices', 'AdaptersModule'])

    .factory('LoadIncidentTypes', ['IncidentType', 'DataStore', function (IncidentType, DataStore) {
        return function () {
            //console.log('LoadIncidentTypes');
            return IncidentType.findAll().then(
                function(incidentTypes) {
                    DataStore.incidentTypes = incidentTypes;
                    return incidentTypes;
                },
                function(error){
                    console.log("IncidentType findAll error:", error);
                }
            );
        }
    }])

    .factory('LoadAllIncidents', ['Incident', 'DataStore', 'LoadIncidentTypesForIncident', function (Incident, DataStore, LoadIncidentTypesForIncident) {
        return function () {
            console.log('Incident resource:', Incident);
            return Incident.findAll().then(
                function(incidents){
                    //console.log("LoadAllIncidents successful - incidents:", incidents);
                    DataStore.incidents = incidents;

                    var promises = [];

                    for(var i=0; i<incidents.length; i++){
                        var incident = incidents[i];
                        var promise = LoadIncidentTypesForIncident(incident);
                        promises.push(promise);
                    }

                    // Wait for all other incident data to load.
                    Promise.all(promises).then(function(incidentTypes){
                        //console.log("Promise.all(promises) incidents:", incidents);
                    });

                    return incidents;
                },
                function(error){
                    console.log("Incident findAll error:", error);
                }
            )
        }
    }])

    .factory('LoadIncidentTypesForIncident', ['IncidentType', 'DataStore', function (IncidentType, DataStore) {
        return function (incident) {
            console.log("check 2");
            var incidentTypeId = incident.incidentType[DataStore.adapter.objIdFieldName];
            return IncidentType.find(incidentTypeId).then(
                function(incidentType){
                    incident.incidentType = incidentType;
                    return incident;
                },
                function(error){
                    console.log("LoadIncidentTypesForIncident - IncidentType findAll error:", error);
                }
            );
        }
    }])

    .factory('LoadIncident', ['Incident', 'DataStore', 'LoadIncidentTypesForIncident', 'LoadIAPForIncident', function (Incident, DataStore, LoadIncidentTypesForIncident, LoadIAPForIncident) {
        return function (incidentObjectId) {
            return Incident.find(incidentObjectId).then(
                function(incident){
                    console.log("check 1");
                    if(incident) {
                        DataStore.incident = incident;


                        //DataStore.incident.incidentType.fetch().then(function(incidentTypeObj){
                        //    ConvertParseObject(incidentTypeObj, INCIDENT_TYPE_DEF);
                        //    DataStore.incident.inc_type_obj= incidentTypeObj;
                        //});
                        //
                        //LoadSectorsForIncident($scope, incident);
                        //LoadAllMaydaysForIncident($scope, incident);
                        //LoadIAPForIncident($scope, incident);
                        //LoadObjectivesForIncident($scope, incident);
                        //LoadOSRForIncident($scope, incident);
                        //LoadUpgradeForIncident($scope, incident);
                        //LoadDispatchedUnitsForIncident($scope, incident);

                        return incident;

                    }
                },
                function(error){
                    console.log("IncidentServices - LoadIncident find error:", error);
                }
            ).then(
                LoadIncidentTypesForIncident,
                function(error){
                    console.log("IncidentServices - LoadIncidentTypesForIncident find error:", error);
                }
            )

                ;
        }
    }])

    //.factory('IncidentTypes', function() {
    //    return new Array();
    //})
    //
    //.controller('StrategyDlg', function($scope, $http, DataStore){
    //    $scope.dataStore = DataStore;
    //    DataStore.showStrategyDlg=function(){
    //        $("#strategy_dlg").dialog('open');
    //    }
    //    $scope.setStrategy = function(strategyType){
    //        DataStore.incident.strategy = strategyType;
    //        DataStore.incident.save();
    //        $("#strategy_dlg").dialog('close');
    //    }
    //})
    //
    //.factory('LoadIncidentTypes', ['IncidentTypes', 'ParseQuery', 'ConvertParseObject', function (IncidentTypes, ParseQuery, ConvertParseObject) {
    //    return function () {
    //        var queryIncidentTypes = new Parse.Query(Parse.Object.extend('IncidentType'));
    //        return queryIncidentTypes.find({
    //            success: function(incidentTypes) {
    //                for(var i=0; i<incidentTypes.length; i++) {
    //                    var incidentType = incidentTypes[i];
    //                    ConvertParseObject(incidentType, INCIDENT_TYPE_DEF);
    //                    IncidentTypes.push(incidentType);
    //                    var nameRefor = incidentType.nameShort.toUpperCase();
    //                    IncidentTypes[nameRefor] = incidentType;
    //                }
    //            },
    //            error: function(error) {
    //                console.log('Failed to LoadIncidentTypes, with error code: ' + error.message);
    //            }
    //        });
    //    }
    //}])
    //
    //.factory('LoadIncident', [
    //    'ConvertParseObject', 'ParseQuery', 'DataStore', 'LoadAllMaydaysForIncident', 'LoadSectorsForIncident', 'LoadIAPForIncident', 'LoadObjectivesForIncident', 'LoadOSRForIncident', 'LoadUpgradeForIncident', 'LoadDispatchedUnitsForIncident',
    //    function (ConvertParseObject, ParseQuery, DataStore, LoadAllMaydaysForIncident, LoadSectorsForIncident, LoadIAPForIncident, LoadObjectivesForIncident, LoadOSRForIncident, LoadUpgradeForIncident, LoadDispatchedUnitsForIncident) {
    //    return function (incidentObjectId, $scope) {
    //        var queryIncident = new Parse.Query(Parse.Object.extend('Incident'));
    //        queryIncident.equalTo("objectId", incidentObjectId);
    //        queryIncident.include('incidentType');
    //        queryIncident.first({
    //            success: function(incident) {
    //                if(incident) {
    //                    ConvertParseObject(incident, INCIDENT_DEF);
    //                    DataStore.incident = incident;
    //                    DataStore.incident.incidentType.fetch().then(function(incidentTypeObj){
    //                        ConvertParseObject(incidentTypeObj, INCIDENT_TYPE_DEF);
    //                        DataStore.incident.inc_type_obj= incidentTypeObj;
    //                    });
    //
    //                    LoadSectorsForIncident($scope, incident);
    //                    LoadAllMaydaysForIncident($scope, incident);
    //                    LoadIAPForIncident($scope, incident);
    //                    LoadObjectivesForIncident($scope, incident);
    //                    LoadOSRForIncident($scope, incident);
    //                    LoadUpgradeForIncident($scope, incident);
    //                    LoadDispatchedUnitsForIncident($scope, incident);
    //
    //                    setTimeout(function(){
    //                        DataStore.loadSuccess = true;
    //                        DataStore.waitingToLoad = false;
    //                        $scope.$apply();
    //                    }, 3500);
    //
    //                } else {
    //                    DataStore.loadSuccess = false;
    //                    DataStore.waitingToLoad = false;
    //                }
    //            },
    //            error: function(error) {
    //                console.log('Failed to LoadIncident, with error code: ' + error.message);
    //            }
    //        });
    //    }
    //}])
    //
    //.factory('Incidents', function() {
    //    return new Array();
    //})
    //
    //.factory('LoadAllIncidents', ['ConvertParseObject', 'ParseQuery', 'Incidents', 'DataStore', function (ConvertParseObject, ParseQuery, Incidents, DataStore) {
    //    return function ($scope) {
    //        Incidents.removeAll();
    //        var query = new Parse.Query(Parse.Object.extend('Incident'));
    //        return query.find({
    //            success: function(incidents) {
    //                for(var i=0; i<incidents.length; i++) {
    //                    var incident = incidents[i];
    //                    ConvertParseObject(incident, INCIDENT_DEF);
    //                    fetchTypeForIncident(incident, $scope, ConvertParseObject);
    //                    Incidents.push(incident);
    //                }
    //                setTimeout(function(){
    //                    console.log("DONE");
    //                    DataStore.loadSuccess = true;
    //                    DataStore.waitingToLoad = false;
    //                    $scope.$apply();
    //                }, 1500);
    //            },
    //            error: function(error) {
    //                console.log('Failed to LoadAllIncidents, with error code: ' + error.message);
    //            }
    //        });
    //    }
    //}])
    //
    //
    //.factory('LoadDispatchedUnitsForIncident', [
    //    'ParseQuery', 'ConvertParseObject', 'DataStore',
    //    function (ParseQuery, ConvertParseObject, DataStore) {
    //        return function ($scope, incident) {
    //            var queryDispatchedUnits = new Parse.Query(Parse.Object.extend('DispatchedUnits'));
    //            queryDispatchedUnits.equalTo("incident", incident);
    //            return queryDispatchedUnits.first({
    //                success: function(dispatchedUnitsObj) {
    //                    if(!dispatchedUnitsObj) {
    //                        var DispatchedUnitsObj = Parse.Object.extend('DispatchedUnits');
    //                        dispatchedUnitsObj = new DispatchedUnitsObj();
    //                        ConvertParseObject(dispatchedUnitsObj , DISPATCHED_UNITS_DEF);
    //                        dispatchedUnitsObj.incident = incident;
    //                        dispatchedUnitsObj.unitTypes = new Array();
    //                        DataStore.dispatchedUnits = dispatchedUnitsObj;
    //                        dispatchedUnitsObj.save(null, {
    //                            error: function(error) {
    //                                console.log('(2) Failed to save dispatechedUnitsObj with error code: ' + error.message);
    //                            }
    //                        });
    //                    } else {
    //                        ConvertParseObject(dispatchedUnitsObj , DISPATCHED_UNITS_DEF);
    //                        DataStore.dispatchedUnits = dispatchedUnitsObj;
    //                        var promises = new Array();
    //                        for(var i=0; i<dispatchedUnitsObj.unitTypes.length; i++) {
    //                            var unitType = dispatchedUnitsObj.unitTypes[i];
    //                            ConvertParseObject(unitType, UNIT_TYPE_DEF);
    //                            var promise = unitType.fetch();
    //                            promises.push(promise);
    //                        }
    //                        Promise.all(promises).then(
    //                            function(unitTypes) {
    //                                DataStore.dispatchedUnits.unitTypes = unitTypes;
    //                            }
    //                        );
    //                    }
    //                },
    //                error: function(error) {
    //                    console.log('Failed to LoadDispatchedUnitsForIncident, with error code: ' + error.message);
    //                }
    //            });
    //        }
    //    }])

;
//
//function fetchTypeForIncident(incident, $scope, ConvertParseObject) {
//    var type = incident.incidentType;
//    if(type) {
//        type.fetch({
//            success: function(type) {
//                $scope.$apply(function(){
//                    ConvertParseObject(type, INCIDENT_TYPE_DEF);
//                    incident.incidentType = type;
//                });
//            },
//            error: function(error) {
//                console.log('Failed to fetchTypeForIncident, with error code: ' + error.message);
//            }
//        });
//    }
//}

