
var INCIDENT_DEF = ['inc_number', 'inc_address', 'incidentType', 'inc_startDate'];
var INCIDENT_TYPE_DEF = ['icon', 'nameLong', 'nameShort', 'order'];
var SECTOR_DEF = ['sectorType', 'row', 'col', 'incident'];
var SECTOR_TYPE_DEF = ['name', 'manyBenchmarkBars', 'hasAcctBtn', 'hasActions', 'hasClock', 'hasPsiBtn', 'isVisible'];

angular.module('DataServices', ['ParseServices'])

    .factory('IncidentTypes', function() {
        return new Array();
    })
    .factory('LoadIncidentTypes', ['IncidentTypes', 'ParseQuery', 'ParseObject', function (IncidentTypes, ParseQuery, ParseObject) {
        return function () {
            var queryIncidentTypes = new Parse.Query(Parse.Object.extend('IncidentType'));
            ParseQuery(queryIncidentTypes, {functionToCall:'find'}).then(function(incidentTypes){
                for(var i=0; i<incidentTypes.length; i++) {
                    var incidentType = new ParseObject(incidentTypes[i], INCIDENT_TYPE_DEF);
                    IncidentTypes.push(incidentType);
                    var nameRefor = incidentType.nameShort.toUpperCase();
                    IncidentTypes[nameRefor] = incidentType;
                }
            });
        }
    }])

    .factory('SectorTypes', function() {
        return new Array();
    })
    .factory('LoadSectorTypes', ['SectorTypes', 'ParseQuery', 'ParseObject', function (SectorTypes, ParseQuery, ParseObject) {
        return function () {
            var querySectorTypes = new Parse.Query(Parse.Object.extend('SectorType'));
            return ParseQuery(querySectorTypes, {functionToCall:'find'}).then(function(sectorTypes){
                for(var i=0; i<sectorTypes.length; i++) {
                    var sectorType = new ParseObject(sectorTypes[i], SECTOR_TYPE_DEF);
                    SectorTypes.push(sectorType);
                    var nameRefor = sectorType.name.replace(" ", "_").toUpperCase();
                    SectorTypes[nameRefor] = sectorType;
                    if (sectorType.name=="Sector Name") {
                        SectorTypes.DEFAULT_SECTOR_TYPE = sectorType;
                    }
                    if (sectorType.name=="Sector ####") {
                        SectorTypes.SECTOR_NUM = sectorType;
                    }
                }//for
            });
        }
    }])

    .factory('DataStore', function() {
        return {
            incident:{},
            waitingToLoad:true,
            loadSuccess:false
        };
    })
    .factory('LoadIncident', ['AddDefaultTbars', 'SaveTbars', 'TbarSectors', 'ParseObject', 'ParseQuery', 'DataStore', function (AddDefaultTbars, SaveTbars, TbarSectors, ParseObject, ParseQuery, DataStore) {
        return function (incidentObjectId, $scope) {
            var queryIncident = new Parse.Query(Parse.Object.extend('Incident'));
            queryIncident.equalTo("objectId", incidentObjectId);
            queryIncident.include('incidentType');
            ParseQuery(queryIncident, {functionToCall:'first'}).then(function(parseObj){
                if(parseObj) {
                    DataStore.incident = new ParseObject(parseObj, INCIDENT_DEF);
                    DataStore.incident.incidentType.fetch().then(function(incidentTypeObj){
                        DataStore.incident.inc_type_obj= new ParseObject(incidentTypeObj, INCIDENT_TYPE_DEF);
                    });

                    var querySectors = new Parse.Query(Parse.Object.extend('Sector'));
                    querySectors.equalTo("incident", DataStore.incident.data);
                    ParseQuery(querySectors, {functionToCall:'find'}).then(function(sectors){
                        if(sectors.length==0) {
                            AddDefaultTbars(DataStore.incident);
                            SaveTbars();
                        } else {
                            for(var i=0; i<sectors.length; i++) {
                                var sector = new ParseObject(sectors[i], SECTOR_DEF);
                                fetchTypeForSector(sector, $scope, ParseObject);
                                TbarSectors.push(sector);
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
    .factory('LoadAllIncidents', ['ParseObject', 'ParseQuery', 'Incidents', function (ParseObject, ParseQuery, Incidents) {
        return function ($scope) {
            var query = new Parse.Query(Parse.Object.extend('Incident'));
            ParseQuery(query, {functionToCall:'find'}).then(function(incidents){
                for(var i=0; i<incidents.length; i++) {
                    var incident = new ParseObject(incidents[i], INCIDENT_DEF);
                    fetchTypeForIncident(incident, $scope, ParseObject);
                    Incidents.push(incident);
                }
            });
        }

    }])


;


function fetchTypeForIncident(incident, $scope, ParseObject) {
    var type = incident.incidentType;
    if(type) {
        type.fetch({
            success: function(type) {
                $scope.$apply(function(){
                    incident.inc_type_obj = new ParseObject(type, INCIDENT_TYPE_DEF);
                });
            }
        });
    }
}

function fetchTypeForSector(sector, $scope, ParseObject) {
    var type = sector.sectorType;
    if(type) {
        type.fetch({
            success: function(type) {
                $scope.$apply(function(){
                    sector.sectorTypeObj= new ParseObject(type, SECTOR_TYPE_DEF);
                });
            }
        });
    }
}

function loadIncidentType(ParseObject, incident) {
    return function(incidentTypeObj){
        incident.inc_type_obj= new ParseObject(incidentTypeObj, INCIDENT_TYPE_DEF);
        incident.test = 'xyz';
    };
}
