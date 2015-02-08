
var INCIDENT_DEF = ['inc_number', 'inc_address', 'incidentType', 'inc_startDate'];
var INCIDENT_TYPE_DEF = ['icon', 'nameLong', 'nameShort', 'order'];
var SECTOR_DEF = ['sectorType', 'row', 'col', 'incident'];
var SECTOR_TYPE_DEF = ['name', 'manyBenchmarkBars', 'hasAcctBtn', 'hasActions', 'hasClock', 'hasPsiBtn', 'isVisible'];
var UNIT_TYPE_DEF = ['name', 'type', 'city'];
var UNIT_DEF = ['actions', 'hasPar', 'manyPeople', 'par', 'psi', 'sector', 'type'];
var ACTION_TYPE_DEF = ['name', 'category', 'is_warning'];

angular.module('DataServices', ['ParseServices'])

    .factory('DefaultCity', function() {
        return "Mesa";
    })

    .factory('DataStore', function() {
        return {
            incident:{},
            waitingToLoad:true,
            loadSuccess:false
        };
    })

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
