
angular.module('UnitServices', ['ParseServices', 'DataServices'])

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

;

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

