
angular.module('ParseAdapter', ['ParseServices'])

    .factory('ParseAdapter', function(LoadUnitsForSector) {
        return {
            init:function(){
                if(ENABLE_SERVER_COMM && typeof Parse!='undefined') {
                    var app_key =   localStorage.getItem('department_app_key');
                    var js_key =    localStorage.getItem('department_js_key');
                    if(app_key && js_key) {
                        Parse.initialize(app_key, js_key);
                    } else {
                        console.log("app_key and js_key not defined.  Logging out.");
                        Parse.User.logOut();
                    }
                }
            },
            LoadUnitsForSector: LoadUnitsForSector
        };
    })

    .factory('LoadUnitsForSector', function ($q, ParseQuery, ConvertParseObject, LoadActionsForUnit, FetchTypeForUnit) {
        return function (sector) {
            var deferred = $q.defer();
            var promises = [];
            sector.units = new Array();
            var queryUnits = new Parse.Query(Parse.Object.extend('Unit'));
            queryUnits.equalTo("sector", sector);
            queryUnits.find({
                success: function(units) {
                    for(var i=0; i<units.length; i++) {
                        var unit = units[i];
                        ConvertParseObject(unit, UNIT_DEF);
                        promises.push(FetchTypeForUnit(unit));
                        promises.push(LoadActionsForUnit(unit));
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
            $q.all(promises)
                .then(
                function(results) {
                    deferred.resolve(results);
                },
                function(errors) {
                    deferred.reject(errors);
                },
                function(updates) {
                    deferred.update(updates);
                });
            return deferred.promise;
        }
    })

    .factory('UpdateUnitsForSector', ['LoadActionsForUnit', 'FetchTypeForUnit', function (LoadActionsForUnit, FetchTypeForUnit) {
        return function ($scope, sector) {
            for(var i=0; i<sector.units.length; i++) {
                var unit = sector.units[i];
                unit.fetch({
                    success:function(unit) {
                        FetchTypeForUnit(unit);
                        LoadActionsForUnit(unit);
                    },
                    error: function(error) {
                        console.log('Failed to UpdateUnitsForSector, with error code: ' + error.message);
                    }
                });
            }
        }
    }])

    .factory('FetchTypeForUnit', function (ConvertParseObject) {
        return function (unit) {
            return unit.type.fetch().then(
                function(type) {
                    ConvertParseObject(type, UNIT_TYPE_DEF);
                    unit.type= type;
                },
                function(error) {
                    console.log('Failed to FetchTypeForUnit, with error code: ' + error.message);
                }
            );
        }
    })

    .factory('LoadActionsForUnit', function (ConvertParseObject) {
        return function (unit) {
            var relation = unit.relation("actions");
            return relation.query().find().then(
                function(actions) {
                    if(!unit.actionsArr) {
                        unit.actionsArr = new Array();
                    }
                    for(var i=0; i<actions.length; i++) {
                        var action = actions[i];
                        ConvertParseObject(action, ACTION_TYPE_DEF);
                        unit.actionsArr.push(action);
                    }
                }, function(obj, error) {
                    console.log('Failed to LoadActionsForUnit, with error code: ' + error.message);
                }
            );
        }
    })

;