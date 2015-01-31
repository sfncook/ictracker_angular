
var INCIDENT_DEF = ['inc_number','inc_address','inc_type','inc_startDate'];
var INCIDENT_TYPE_DEF = ['icon','nameLong','nameShort'];
var SECTOR_DEF = ['sectorType', 'row', 'col', 'incident'];
var SECTOR_TYPE_DEF = ['name', 'hasAcctBtn', 'hasActions', 'hasClock', 'hasPsiBtn', 'isVisible'];

angular.module('DataServices', ['ParseServices'])

    .factory('Incidents', function() {
        return new Array();
    })

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
                DataStore.incident.inc_type.fetch().then(function(incidentTypeObj){
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

;

function loadSectorType(ParseObject, sector) {
    return function(sectorTypeObj){
        sector.sectorTypeObj= new ParseObject(sectorTypeObj, SECTOR_TYPE_DEF);
    };
}
