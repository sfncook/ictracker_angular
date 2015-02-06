
var INCIDENT_DEF = ['inc_number', 'inc_address', 'incidentType', 'inc_startDate'];
var INCIDENT_TYPE_DEF = ['icon', 'nameLong', 'nameShort', 'order'];
var SECTOR_DEF = ['sectorType', 'row', 'col', 'incident'];
var SECTOR_TYPE_DEF = ['name', 'manyBenchmarkBars', 'hasAcctBtn', 'hasActions', 'hasClock', 'hasPsiBtn', 'isVisible'];
var UNIT_TYPE_DEF = ['name', 'type', 'city'];
var UNIT_DEF = ['actions', 'hasPar', 'manyPeople', 'par', 'psi', 'sector', 'type'];

angular.module('DataServices', ['ParseServices'])

    .factory('DefaultCity', function() {
        return "Mesa";
    })

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

    .factory('SectorTypes', function() {
        return new Array();
    })
    .factory('LoadSectorTypes', ['SectorTypes', 'ParseQuery', 'ConvertParseObject', function (SectorTypes, ParseQuery, ConvertParseObject) {
        return function () {
            var querySectorTypes = new Parse.Query(Parse.Object.extend('SectorType'));
            return ParseQuery(querySectorTypes, {functionToCall:'find'}).then(function(sectorTypes){
                for(var i=0; i<sectorTypes.length; i++) {
                    var sectorType = sectorTypes[i];
                    ConvertParseObject(sectorType, SECTOR_TYPE_DEF);
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

    .factory('UnitTypes', function() {
        return new Array();
    })
    .factory('LoadUnitTypes', ['UnitTypes', 'ParseQuery', 'ConvertParseObject', function (UnitTypes, ParseQuery, ConvertParseObject) {
        return function () {
            var queryUniTypes = new Parse.Query(Parse.Object.extend('UnitType'));
            queryUniTypes.limit(1000);
            return ParseQuery(queryUniTypes, {functionToCall:'find'}).then(function(unitTypes){
                for(var i=0; i<unitTypes.length; i++) {
                    var unitType = unitTypes[i];
                    ConvertParseObject(unitType, UNIT_TYPE_DEF);
                    UnitTypes.push(unitType);
                    var nameRefor = unitType.name.toUpperCase();
                    UnitTypes[nameRefor] = unitType;
                }//for
            });
        }
    }])
    .factory('LoadUnitsForSector', ['ParseQuery', 'ConvertParseObject', function (ParseQuery, ConvertParseObject) {
        return function (sector, $scope) {
            sector.units = new Array();
            var queryUnits = new Parse.Query(Parse.Object.extend('Unit'));
            queryUnits.equalTo("sector", sector);
            ParseQuery(queryUnits, {functionToCall:'find'}).then(function(units){
                for(var i=0; i<units.length; i++) {
                    var unit = units[i];
                    ConvertParseObject(unit, UNIT_DEF);
                    fetchTypeForUnit(unit, $scope, ConvertParseObject);
                    sector.units.push(unit);
                }

                if(units.length>0) {
                    sector.selectedUnit=units[0];
                }
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

    .factory('CreateNewUnit', ['ConvertParseObject', function (ConvertParseObject) {
        return function (sector, unitType) {
            var UnitParseObj = Parse.Object.extend('Unit');
            var newUnit = new UnitParseObj();
            ConvertParseObject(newUnit, UNIT_DEF);
            newUnit.actions = new Array();
            newUnit.hasPar = false;
            newUnit.manyPeople = 0;
            newUnit.par = 0;
            newUnit.psi = 4000;
            newUnit.type = unitType;
            newUnit.sector = sector;
            newUnit.save();
            sector.units.push(newUnit);
            return newUnit;
        }
    }])

    .factory('ConvertParseObject', [function () {
        return function (parseObject, fields) {
            //add dynamic properties from fields array
            for (var i = 0; i < fields.length; i++) {
                //add closure
                (function () {
                    var propName = fields[i];
                    Object.defineProperty(parseObject, propName, {
                        get: function () {
                            return parseObject.get(propName);
                        },
                        set: function (value) {
                            parseObject.set(propName, value);
                        }
                    });
                })();
            }
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

function fetchTypeForUnit(unit, $scope, ConvertParseObject) {
    var type = unit.type;
    if(type) {
        type.fetch({
            success: function(type) {
                $scope.$apply(function(){
                    ConvertParseObject(type, UNIT_TYPE_DEF);
                    unit.type= type;
                });
            }
        });
    }
}

function loadIncidentType(ConvertParseObject, incident) {
    return function(incidentTypeObj){
        ConvertParseObject(incidentTypeObj, INCIDENT_TYPE_DEF);
        incident.inc_type_obj= incidentTypeObj;
        incident.test = 'xyz';
    };
}
