
angular.module('UnitServices', ['DataServices', 'AdapterServices'])

    .factory('UnitTypes', function() {
        return new Array();
    })

    .factory('LoadUnitTypes', function (AdapterStore) {
        return function () {
            return AdapterStore.adapter.LoadUnitTypes();
        }
    })


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

