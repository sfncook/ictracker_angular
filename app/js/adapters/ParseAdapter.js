
angular.module('ParseAdapter', ['ParseServices'])

    .factory('ParseAdapter', function(LoadIncident_A) {
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
            LoadIncident: LoadIncident_A
        };
    })


    .factory('FetchTypeForIncident_A', function (ConvertParseObject) {
        return function (incident) {
            return incident.incidentType.fetch().then(function(type) {
                ConvertParseObject(type, INCIDENT_TYPE_DEF);
                incident.incidentType = type;
                return incident;
            });
        }
    })
    .factory('LoadIAPForIncident_A', function (ConvertParseObject) {
        return function (incident) {
            var queryIap = new Parse.Query(Parse.Object.extend('Iap'));
            queryIap.equalTo("incident", incident);
            queryIap.equalTo("incident", incident);
            return queryIap.first().then(
                function(iapObject){
                    if (iapObject){
                        ConvertParseObject(iapObject, IAP_DEF);
                        incident.iap = iapObject;
                    } else {
                        incident.iap = 'UNDEFINED';
                    }
                    return incident;
                }
            );
        }
    })

    .factory('FetchAcctTypeForSector_A', function (ConvertParseObject) {
        return function (sector) {
            if(sector.acctUnit) {
                return sector.acctUnit.fetch().then(
                    function(acctUnit) {
                        ConvertParseObject(acctUnit, UNIT_TYPE_DEF);
                        sector.acctUnit = acctUnit;
                        return sector;
                    },
                    function(error) {
                        console.log('Failed to FetchAcctTypeForSector, with error code: ' + error.message);
                    }
                );
            }
        }
    })

    .factory('FetchTypeForSector_A', function (ConvertParseObject) {
        return function (sector) {
            return sector.sectorType.fetch().then(
                function(type) {
                    ConvertParseObject(type, SECTOR_TYPE_DEF);
                    sector.sectorType= type;
                    return sector;
                },
                function(error) {
                    console.log('Failed to FetchTypeForSector, with error code: ' + error.message);
                }
            );
        }
    })

    .factory('FetchTypeForUnit_A', function (ConvertParseObject) {
        return function (unit) {
            return unit.type.fetch().then(
                function(type) {
                    ConvertParseObject(type, UNIT_TYPE_DEF);
                    unit.type= type;
                    return unit;
                },
                function(error) {
                    console.log('Failed to FetchTypeForUnit_A, with error code: ' + error.message);
                }
            );
        }
    })

    .factory('FetchUnitTypeForMayday_A', function (ConvertParseObject) {
        return function (mayday) {
            if(mayday.unitType) {
                return mayday.unitType.fetch().then(
                    function(unitType) {
                        ConvertParseObject(unitType, UNIT_TYPE_DEF);
                        mayday.unitType = unitType;
                        return mayday;
                    },
                    function(error) {
                        console.log('Failed to FetchUnitTypeForMayday, with error code: ' + error.message);
                    }
                );
            }
        }
    })
    .factory('FetchSectorTypeForMayday_A', function (ConvertParseObject) {
        return function (mayday) {
            if(mayday.sectorType) {
                return mayday.sectorType.fetch().then(
                    function(sectorType) {
                        ConvertParseObject(sectorType, SECTOR_TYPE_DEF);
                        mayday.sectorType = sectorType;
                        return mayday;
                    },
                    function(error) {
                        console.log('Failed to FetchSectorTypeForMayday, with error code: ' + error.message);
                    }
                );
            }
        }
    })
    .factory('FetchActionsForUnit_A', function (ConvertParseObject) {
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
                    return unit;
                }, function(obj, error) {
                    console.log('Failed to LoadActionsForUnit, with error code: ' + error.message);
                }
            );
        }
    })
    .factory('LoadUnitsForSector_A',
    function ($q, ConvertParseObject, FetchTypeForUnit_A, FetchActionsForUnit_A) {
        return function (sector) {
            sector.units = new Array();
            var queryUnits = new Parse.Query(Parse.Object.extend('Unit'));
            queryUnits.equalTo("sector", sector);
            return queryUnits.find().then(function(units){
                var promises = [];
                for(var i=0; i<units.length; i++) {
                    var unit = units[i];
                    ConvertParseObject(unit, UNIT_DEF);
                    sector.units.push(unit);
                    promises.push(FetchTypeForUnit_A(unit));
                    promises.push(FetchActionsForUnit_A(unit));
                }
                return $q.all(promises);
            });
        }
    })
    .factory('LoadSectorsForIncident_A',
    function ($q, ConvertParseObject, FetchAcctTypeForSector_A, TbarSectors, FetchTypeForSector_A, LoadUnitsForSector_A) {
        return function (incident) {
            var querySectors = new Parse.Query(Parse.Object.extend('Sector'));
            querySectors.equalTo("incident", incident);
            querySectors.include('sectorType');
            return querySectors.find().then(function(sectors){
                var promises = [];
                for(var i=0; i<sectors.length; i++) {
                    var sector = sectors[i];
                    ConvertParseObject(sector, SECTOR_DEF);
                    TbarSectors.push(sector);
                    promises.push(FetchTypeForSector_A(sector));
                    promises.push(LoadUnitsForSector_A(sector));
                    promises.push(FetchAcctTypeForSector_A(sector));
                }
                return $q.all(promises);
            });
        }
    })
    .factory('LoadAllMaydaysForIncident_A',
    function ($q, Maydays, ConvertParseObject, FetchUnitTypeForMayday_A, FetchSectorTypeForMayday_A) {
        return function (incident) {
            var queryMaydays = new Parse.Query(Parse.Object.extend('Mayday'));
            queryMaydays.equalTo("incident", incident);
            queryMaydays.include('unitType');
            queryMaydays.include('sectorType');
            return queryMaydays.find().then(function(maydays){
                var promises = [];
                for(var i=0; i<maydays.length; i++) {
                    var mayday = maydays[i];
                    ConvertParseObject(mayday, MAYDAY_DEF);
                    Maydays.push(mayday);
                    promises.push(FetchUnitTypeForMayday_A(mayday));
                    promises.push(FetchSectorTypeForMayday_A(mayday));
                }
                return $q.all(promises);
            });
        }
    })
    .factory('CreateNewObjectives_A', function (ConvertParseObject, DataStore) {
        return function (incident) {
            var ObjectivesParseObj = Parse.Object.extend('Objectives');
            var objectivesObject = new ObjectivesParseObj();
            ConvertParseObject(objectivesObject, OBJECTIVES_DEF);
            objectivesObject.upgradeToFullRescue    = false;
            objectivesObject.assingSafety           = false;
            objectivesObject.establishSupplyLine    = false;
            objectivesObject.secureUtilities        = false;
            objectivesObject.ventiliation           = false;
            objectivesObject.createOnDeck           = false;
            objectivesObject.pressurizeExposures    = false;
            objectivesObject.monitorChannel16       = false;
            objectivesObject.salvage                = false;
            objectivesObject.establishRehab         = false;
            objectivesObject.customerService        = false;
            objectivesObject.incident               = incident;
            return objectivesObject;
        }
    })
    .factory('FetchObjectivesForIncident_A', function (ConvertParseObject, CreateNewObjectives_A, DataStore) {
        return function (incident) {
            var queryObjectives = new Parse.Query(Parse.Object.extend('Objectives'));
            queryObjectives.equalTo("incident", incident);
            return queryObjectives.first().then(
                function(objectivesObject){
                    if (objectivesObject){
                        ConvertParseObject(objectivesObject, OBJECTIVES_DEF);
                        DataStore.objectives = objectivesObject;
                    } else {
                        DataStore.objectives = CreateNewObjectives_A(incident);
                    }
                    return incident;
                }
            );
        }
    })
    .factory('FetchOSRForIncident_A', function (ConvertParseObject, DataStore, CreateNewOSR_A) {
        return function (incident) {
            var queryOSR = new Parse.Query(Parse.Object.extend('OSR'));
            queryOSR.equalTo("incident", incident);
            return queryOSR.first().then(
                function(osrObject){
                    if (osrObject){
                        ConvertParseObject(osrObject, OSR_DEF);
                        DataStore.osr = osrObject;
                    } else {
                        DataStore.osr = CreateNewOSR_A(incident);
                    }
                    DataStore.updateOSRPerc();
                    return incident;
                }
            );
        }
    })
    .factory('CreateNewOSR_A', function (ConvertParseObject) {
        return function (incident) {
            var OSRParseObj = Parse.Object.extend('OSR');
            var osrObject = new OSRParseObj();
            ConvertParseObject(osrObject, OSR_DEF);
            osrObject.isAddress                 = false;
            osrObject.isOccupancy               = false;
            osrObject.isConstruction            = false;
            osrObject.isAssumeCommand           = false;
            osrObject.isLocation                = false;
            osrObject.isStrategy                = false;
            osrObject.isAttackLine              = false;
            osrObject.isWaterSupply             = false;
            osrObject.isIRIC                    = false;
            osrObject.isBasement                = false;
            osrObject.isMobile                  = false;
            osrObject.isDefensive               = false;

            osrObject.accountability            = '';
            osrObject.accountabilityLocation    = '';
            osrObject.unit                      = '';
            osrObject.dispatchAddress           = '';
            osrObject.sizeOfBuilding            = '';
            osrObject.numberOfFloors            = '';
            osrObject.typeOfBuilding            = '';
            osrObject.subFloors                 = '';
            osrObject.constructionType          = '';
            osrObject.roofType                  = '';
            osrObject.conditions                = '';

            osrObject.incident                  = incident;
            return osrObject;
        }
    })
    .factory('LoadDispatchedUnitsForIncident_A', function ($q, ConvertParseObject, DataStore) {
        return function (incident) {
            var queryDispatchedUnits = new Parse.Query(Parse.Object.extend('DispatchedUnits'));
            queryDispatchedUnits.equalTo("incident", incident);
            return queryDispatchedUnits.first().then(function(dispatchedUnitsObj){
                if(!dispatchedUnitsObj) {
                    var DispatchedUnitsObj = Parse.Object.extend('DispatchedUnits');
                    dispatchedUnitsObj = new DispatchedUnitsObj();
                    ConvertParseObject(dispatchedUnitsObj , DISPATCHED_UNITS_DEF);
                    dispatchedUnitsObj.incident = incident;
                    dispatchedUnitsObj.unitTypes = new Array();
                    DataStore.dispatchedUnits = dispatchedUnitsObj;
                    return dispatchedUnitsObj.save(null, {
                        error: function(error) {
                            console.log('(2) Failed to save dispatechedUnitsObj with error code: ' + error.message);
                        }
                    });
                } else {
                    ConvertParseObject(dispatchedUnitsObj , DISPATCHED_UNITS_DEF);
                    DataStore.dispatchedUnits = dispatchedUnitsObj;
                    for(var i=0; i<dispatchedUnitsObj.unitTypes.length; i++) {
                        var unitType = dispatchedUnitsObj.unitTypes[i];
                        ConvertParseObject(unitType, UNIT_TYPE_DEF);
                    }
                    return incident;
                }
            });
        }
    })
    .factory('LoadIncident_A', function (
        $q, ConvertParseObject,
        FetchTypeForIncident_A, LoadIAPForIncident_A, LoadSectorsForIncident_A,
        LoadAllMaydaysForIncident_A, FetchObjectivesForIncident_A, FetchOSRForIncident_A,
        LoadUpgradeForIncident, LoadDispatchedUnitsForIncident_A) {
        return function (incidentObjectId) {
            var queryIncident = new Parse.Query(Parse.Object.extend('Incident'));
            queryIncident.equalTo("objectId", incidentObjectId);
            queryIncident.include('incidentType');
            return queryIncident.first().then(function(incident){
                if(incident) {
                    ConvertParseObject(incident, INCIDENT_DEF);

                    var promises = [];
                    promises.push(FetchTypeForIncident_A(incident));
                    promises.push(LoadSectorsForIncident_A(incident));
                    promises.push(LoadAllMaydaysForIncident_A(incident));
                    promises.push(LoadIAPForIncident_A(incident));
                    promises.push(FetchObjectivesForIncident_A(incident));
                    promises.push(FetchOSRForIncident_A(incident));
                    promises.push(LoadUpgradeForIncident(incident));
                    promises.push(LoadDispatchedUnitsForIncident_A(incident));
                }
                return $q.all(promises).then(function(bunchOfObjects){
                    // Ignore the bunchOfObjects.  We just want to return the incident:
                    return incident;
                });
            });
        }
    })

;