
angular.module('IncidentServices', ['ParseServices', 'DataServices'])

    .factory('IncidentTypes', function() {
        return new Array();
    })

    .factory('LoadIncidentTypes', ['IncidentTypes', 'ParseQuery', 'ConvertParseObject', function (IncidentTypes, ParseQuery, ConvertParseObject) {
        return function () {
            var queryIncidentTypes = new Parse.Query(Parse.Object.extend('IncidentType'));
            ParseQuery(queryIncidentTypes, {functionToCall:'find'}).then(function(incidentTypes){
                for(var i=0; i<incidentTypes.length; i++) {
                    var incidentType = incidentTypes[i];
                    ConvertParseObject(incidentType, INCIDENT_TYPE_DEF);
                    IncidentTypes.push(incidentType);
                    var nameRefor = incidentType.nameShort.toUpperCase();
                    IncidentTypes[nameRefor] = incidentType;
                }
            });
        }
    }])

    .factory('LoadIncident', [
        'LoadUnitsForSector', 'AddDefaultTbars', 'SaveTbars', 'TbarSectors', 'ConvertParseObject', 'ParseQuery', 'DataStore',
        function (LoadUnitsForSector, AddDefaultTbars, SaveTbars, TbarSectors, ConvertParseObject, ParseQuery, DataStore) {
        return function (incidentObjectId, $scope) {
            var queryIncident = new Parse.Query(Parse.Object.extend('Incident'));
            queryIncident.equalTo("objectId", incidentObjectId);
            queryIncident.include('incidentType');
            ParseQuery(queryIncident, {functionToCall:'first'}).then(function(incident){
                if(incident) {
                    ConvertParseObject(incident, INCIDENT_DEF);
                    DataStore.incident = incident;
                    DataStore.incident.incidentType.fetch().then(function(incidentTypeObj){
                        ConvertParseObject(incidentTypeObj, INCIDENT_TYPE_DEF);
                        DataStore.incident.inc_type_obj= incidentTypeObj;
                    });

                    var querySectors = new Parse.Query(Parse.Object.extend('Sector'));
                    querySectors.equalTo("incident", DataStore.incident);
                    ParseQuery(querySectors, {functionToCall:'find'}).then(function(sectors){
                        if(sectors.length==0) {
                            AddDefaultTbars(DataStore.incident);
                            SaveTbars();
                        } else {
                            for(var i=0; i<sectors.length; i++) {
                                var sector = sectors[i];
                                ConvertParseObject(sector, SECTOR_DEF);
                                fetchTypeForSector(sector, $scope, ConvertParseObject);
                                TbarSectors.push(sector);
                                LoadUnitsForSector(sector, $scope);
                            }
                            DataStore.loadSuccess = true;
                            DataStore.waitingToLoad = false;
                        }
                    });
                } else {
                    DataStore.loadSuccess = false;
                    DataStore.waitingToLoad = false;
                }
            });
        }
    }])

    .factory('Incidents', function() {
        return new Array();
    })

    .factory('LoadAllIncidents', ['ConvertParseObject', 'ParseQuery', 'Incidents', function (ConvertParseObject, ParseQuery, Incidents) {
        return function ($scope) {
            var query = new Parse.Query(Parse.Object.extend('Incident'));
            ParseQuery(query, {functionToCall:'find'}).then(function(incidents){
                for(var i=0; i<incidents.length; i++) {
                    var incident = incidents[i];
                    ConvertParseObject(incident, INCIDENT_DEF);
                    fetchTypeForIncident(incident, $scope, ConvertParseObject);
                    Incidents.push(incident);
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
            }
        });
    }
}


function fetchTypeForSector(sector, $scope, ConvertParseObject) {
    var type = sector.sectorType;
    if(type) {
        type.fetch({
            success: function(type) {
                $scope.$apply(function(){
                    ConvertParseObject(type, SECTOR_TYPE_DEF);
                    sector.sectorType= type;
                });
            }
        });
    }
}
