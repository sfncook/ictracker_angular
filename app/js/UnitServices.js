
angular.module('UnitServices', ['ParseServices', 'DataServices'])

    .factory('UnitTypes', function() {
        return new Array();
    })

    .factory('LoadUnitTypes', ['UnitTypes', 'ParseQuery', 'ConvertParseObject', function (UnitTypes, ParseQuery, ConvertParseObject) {
        return function () {
            var queryUniTypes = new Parse.Query(Parse.Object.extend('UnitType'));
            queryUniTypes.limit(1000);
            return queryUniTypes.find({
                success: function(unitTypes) {
                    for(var i=0; i<unitTypes.length; i++) {
                        var unitType = unitTypes[i];
                        ConvertParseObject(unitType, UNIT_TYPE_DEF);
                        UnitTypes.push(unitType);
                        var nameRefor = unitType.name.toUpperCase();
                        UnitTypes[nameRefor] = unitType;
                    }//for
                },
                error: function(error) {
                    console.log('Failed to LoadUnitTypes, with error code: ' + error.message);
                }
            });
        }
    }])


    .factory('CreateNewUnit', ['ConvertParseObject', 'DefaultErrorLogger', function (ConvertParseObject, DefaultErrorLogger) {
        return function (sector, unitType) {
            var UnitParseObj = Parse.Object.extend('Unit');
            var newUnit = new UnitParseObj();
            ConvertParseObject(newUnit, UNIT_DEF);
//            newUnit.actions = new Array();
            newUnit.hasPar = false;
            newUnit.manyPeople = 0;
            newUnit.par = 0;
            newUnit.psi = 4000;
            newUnit.type = unitType;
            newUnit.sector = sector;
            newUnit.save(null, DefaultErrorLogger);
            return newUnit;
        }
    }])

;

