
angular.module('ParseAdapter', ['ParseServices'])

    .factory('ParseAdapter', function(LoadSectorsForIncidentParse) {
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
            LoadSectorsForIncident: LoadSectorsForIncidentParse
        };
    })

    .factory('LoadSectorsForIncidentParse',
    function ($q, LoadUnitsForSector, AddDefaultTbars, SaveTbars, TbarSectors, ConvertParseObject, FetchTypeForSector, FetchAcctTypeForSector) {
        return function (incident) {
            var querySectors = new Parse.Query(Parse.Object.extend('Sector'));
            querySectors.equalTo("incident", incident);
            return querySectors.find({
                success: function(sectors) {
                    var promises = [];
                    if(sectors.length==0) {
                        AddDefaultTbars(incident);
                        SaveTbars();
                    } else {
                        for(var i=0; i<sectors.length; i++) {
                            var sector = sectors[i];
                            ConvertParseObject(sector, SECTOR_DEF);
                            TbarSectors.push(sector);
                            promises.push(FetchTypeForSector(sector));
                            promises.push(LoadUnitsForSector(sector));
                            promises.push(FetchAcctTypeForSector(sector));
                        }
                    }
                    //console.log("End of LoadSectorsForIncidentParse");
                    return $q.all(promises);
                },
                error: function(error) {
                    console.log('Failed to LoadSectorsForIncident, with error code: ' + error.message);
                }
            });
        }
    })

    .factory('FetchTypeForSector', function (ConvertParseObject) {
        return function (sector) {
            sector.sectorType.fetch().then(
                function(type) {
                    ConvertParseObject(type, SECTOR_TYPE_DEF);
                    sector.sectorType= type;
                    //console.log("End of FetchTypeForSector");
                    return sector;
                },
                function(error) {
                    console.log('Failed to FetchTypeForSector, with error code: ' + error.message);
                }
            );
        }
    })

    .factory('LoadUnitsForSector', function ($q, ParseQuery, ConvertParseObject, LoadActionsForUnit, FetchTypeForUnit) {
        return function (sector) {
            sector.units = new Array();
            var queryUnits = new Parse.Query(Parse.Object.extend('Unit'));
            queryUnits.equalTo("sector", sector);
            return queryUnits.find({
                success: function(units) {
                    var promises = [];
                    for(var i=0; i<units.length; i++) {
                        var unit = units[i];
                        ConvertParseObject(unit, UNIT_DEF);
                        sector.units.push(unit);
                        promises.push(FetchTypeForUnit(unit));
                        promises.push(LoadActionsForUnit(unit));
                    }

                    if(units.length>0) {
                        sector.selectedUnit=units[0];
                    }
                    return $q.all(promises);
                },
                error: function(error) {
                    console.log('Failed to LoadUnitTypes, with error code: ' + error.message);
                }
            }).then(function(units){
                console.log("End of LoadUnitsForSector units:", units);
                return units;
            });
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
                    console.log("End of FetchTypeForUnit");
                    return unit;
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
                    console.log("End of LoadActionsForUnit");
                    return unit;
                }, function(obj, error) {
                    console.log('Failed to LoadActionsForUnit, with error code: ' + error.message);
                }
            );
        }
    })

    .factory('FetchAcctTypeForSector', function (ConvertParseObject) {
        return function (sector) {
            if(sector.acctUnit){
                sector.acctUnit.fetch().then(
                    function(acctUnit) {
                        ConvertParseObject(acctUnit, UNIT_TYPE_DEF);
                        sector.acctUnit = acctUnit;
                    },
                    function(error) {
                        console.log('Failed to FetchAcctTypeForSector, with error code: ' + error.message);
                    }
                );
            }
        }
    })

;