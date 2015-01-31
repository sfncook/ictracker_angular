
var INCIDENT_DEF = ['inc_number', 'inc_address', 'incidentType', 'inc_startDate'];
var INCIDENT_TYPE_DEF = ['icon', 'nameLong', 'nameShort', 'order'];
var SECTOR_DEF = ['sectorType', 'row', 'col', 'incident'];
var SECTOR_TYPE_DEF = ['name', 'hasAcctBtn', 'hasActions', 'hasClock', 'hasPsiBtn', 'isVisible'];

angular.module('DataServices', ['ParseServices'])

    .factory('SectorTypes', function() {
        return new Array();
    })
    .factory('LoadSectorTypes', ['SectorTypes', 'ParseQuery', 'ParseObject', function (SectorTypes, ParseQuery, ParseObject) {
        return function () {
            var querySectorTypes = new Parse.Query(Parse.Object.extend('SectorType'));
            ParseQuery(querySectorTypes, {functionToCall:'find'}).then(function(parseObj){
                var sectorType = new ParseObject(parseObj, SECTOR_TYPE_DEF);
                SectorTypes.push(sectorType);
            });
        }
    }])

    .factory('DataStore', function() {
        return {incident:{}};
    })
    .factory('LoadIncident', ['AddDefaultTbars', 'TbarSectors', 'ParseObject', 'ParseQuery', 'DataStore', function (AddDefaultTbars, TbarSectors, ParseObject, ParseQuery, DataStore) {
        return function (incidentObjectId) {
            var queryIncident = new Parse.Query(Parse.Object.extend('Incident'));
            queryIncident.equalTo("objectId", incidentObjectId);
            queryIncident.include('inc_type');
            ParseQuery(queryIncident, {functionToCall:'first'}).then(function(parseObj){
                DataStore.incident = new ParseObject(parseObj, INCIDENT_DEF);
                DataStore.incident.incidentType.fetch().then(function(incidentTypeObj){
                    DataStore.incident.inc_type_obj= new ParseObject(incidentTypeObj, INCIDENT_TYPE_DEF);
                });

                var querySectors = new Parse.Query(Parse.Object.extend('Sector'));
                querySectors.equalTo("incident", DataStore.incident.data);
                ParseQuery(querySectors, {functionToCall:'find'}).then(function(sectors){
                    if(sectors.length==0) {
                        AddDefaultTbars();
                    } else {
                        for(var i=0; i<sectors.length; i++) {
                            var sector = new ParseObject(sectors[i], SECTOR_DEF);
                            sector.sectorType.fetch().then(loadSectorType(ParseObject, sector));
                            TbarSectors.push(sector);
                        }
                    }
                });
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

function loadSectorType(ParseObject, sector) {
    return function(sectorTypeObj){
        sector.sectorTypeObj= new ParseObject(sectorTypeObj, SECTOR_TYPE_DEF);
    };
}

function loadIncidentType(ParseObject, incident) {
    return function(incidentTypeObj){
        incident.inc_type_obj= new ParseObject(incidentTypeObj, INCIDENT_TYPE_DEF);
        incident.test = 'xyz';
    };
}
