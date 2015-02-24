
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

    .factory('LoadUnitsForSector', ['ParseQuery', 'ConvertParseObject', 'LoadActionsForUnit', 'FetchTypeForUnit', function (ParseQuery, ConvertParseObject, LoadActionsForUnit, FetchTypeForUnit) {
        return function (sector, $scope) {
            sector.units = new Array();
            var queryUnits = new Parse.Query(Parse.Object.extend('Unit'));
            queryUnits.equalTo("sector", sector);
            queryUnits.find({
                success: function(units) {
                    for(var i=0; i<units.length; i++) {
                        var unit = units[i];
                        ConvertParseObject(unit, UNIT_DEF);
                        FetchTypeForUnit($scope, unit);
                        LoadActionsForUnit($scope, unit);
                        sector.units.push(unit);
                    }

                    if(units.length>0) {
                        sector.selectedUnit=units[0];
                    }
                },
                error: function(error) {
                    console.log('Failed to LoadUnitTypes, with error code: ' + error.message);
                }
            });
        }
    }])



    .factory('UpdateUnitsForSector', ['LoadActionsForUnit', 'FetchTypeForUnit', function (LoadActionsForUnit, FetchTypeForUnit) {
        return function ($scope, sector) {
            for(var i=0; i<sector.units.length; i++) {
                var unit = sector.units[i];
                unit.fetch({
                    success:function(unit) {
                        FetchTypeForUnit($scope, unit);
                        LoadActionsForUnit($scope, unit);
                    },
                    error: function(error) {
                        console.log('Failed to UpdateUnitsForSector, with error code: ' + error.message);
                    }
                });
            }
        }
    }])

    .factory('FetchTypeForUnit', ['ParseQuery', 'ConvertParseObject', function (ParseQuery, ConvertParseObject) {
        return function ($scope, unit) {
            var type = unit.type;
            if(type) {
                type.fetch({
                    success: function(type) {
                        $scope.$apply(function(){
                            ConvertParseObject(type, UNIT_TYPE_DEF);
                            unit.type= type;
                        });
                    },
                    error: function(error) {
                        console.log('Failed to FetchTypeForUnit, with error code: ' + error.message);
                    }
                });
            }
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
            sector.units.push(newUnit);
            return newUnit;
        }
    }])

;

