
angular.module('ParseAdapter', ['ParseServices','ObjectivesServices', 'OSRServices', 'ActionServices', 'SectorServices', 'UnitServices'])

    .factory('ParseAdapter', function(
        LoadIncident_Parse, LoadAllIncidents_Parse, LoadIncidentTypes_Parse, UpdateIncidentAsNeeded_Parse, isLoggedIn_Parse,
        LoadActionTypes_Parse, LoadSectorTypes_Parse, LoadUnitTypes_Parse,
        SaveSector_Parse, SaveReportAction_Parse
    ) {
        return {
            adapter_id_str:'parse',
            init:function(){
                if(ENABLE_SERVER_COMM && typeof Parse!='undefined') {
                    var app_key =   localStorage.getItem('department_app_key');
                    var js_key =    localStorage.getItem('department_js_key');
                    if(app_key && js_key) {
                        Parse.initialize(app_key, js_key);
                        return true;
                    } else {
                        console.log("app_key and js_key not defined.  Logging out.");
                        try{
                            Parse.User.logOut();
                        } catch(err) {
                            console.log("Error try to run Parse.User.logOut()  err:", err);
                        }
                        return false;
                    }
                }
            },
            LoadIncidentTypes:      LoadIncidentTypes_Parse,
            LoadAllIncidents:       LoadAllIncidents_Parse,
            LoadIncident:           LoadIncident_Parse,
            UpdateIncidentAsNeeded: UpdateIncidentAsNeeded_Parse,
            isLoggedIn:             isLoggedIn_Parse,
            LoadActionTypes:        LoadActionTypes_Parse,
            LoadSectorTypes:        LoadSectorTypes_Parse,
            LoadUnitTypes:          LoadUnitTypes_Parse,
            SaveSector:             SaveSector_Parse,
            SaveReportAction:       SaveReportAction_Parse
        };
    })

    .factory('isLoggedIn_Parse', function () {
        return function () {
            return Parse.User.current();
        }
    })

    .factory('FetchTypeForIncident_Parse', function (ConvertParseObject) {
        return function (incident) {
            return incident.incidentType.fetch().then(function(type) {
                ConvertParseObject(type, INCIDENT_TYPE_DEF);
                incident.incidentType = type;
                return incident;
            });
        }
    })
    .factory('CreateNewIap_Parse', function (ConvertParseObject) {
        return function (incident) {
            var IapParseObj = Parse.Object.extend('Iap');
            var iapObject = new IapParseObj();
            ConvertParseObject(iapObject, IAP_DEF);
            iapObject.isActionEffect=false;
            iapObject.isArrangement=false;
            iapObject.isBuilding=false;
            iapObject.isFire=false;
            iapObject.isLifeHazard=false;
            iapObject.isOccupancy=false;
            iapObject.isResources=false;
            iapObject.isSpecial=false;
            iapObject.isSprinkler=false;
            iapObject.isVent=false;
            iapObject.fireControl="";
            iapObject.firefighterSafety="";
            iapObject.propertyPeople="";
            iapObject.evacuationLocation="";
            iapObject.rescue="";
            iapObject.incident=incident;
            return iapObject;
        }
    })
    .factory('LoadIAPForIncident_Parse', function (ConvertParseObject, CreateNewIap_Parse) {
        return function (incident) {
            var queryIap = new Parse.Query(Parse.Object.extend('Iap'));
            queryIap.equalTo("incident", incident);
            return queryIap.first().then(
                function(iapObject){
                    if (iapObject){
                        ConvertParseObject(iapObject, IAP_DEF);
                        incident.iap = iapObject;
                    } else {
                        incident.iap = CreateNewIap_Parse(incident);
                    }
                    return incident;
                }
            );
        }
    })

    .factory('FetchAcctTypeForSector_Parse', function (ConvertParseObject) {
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

    .factory('FetchTypeForSector_Parse', function (ConvertParseObject) {
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

    .factory('FetchTypeForUnit_Parse', function (ConvertParseObject) {
        return function (unit) {
            return unit.type.fetch().then(
                function(type) {
                    ConvertParseObject(type, UNIT_TYPE_DEF);
                    unit.type= type;
                    return unit;
                },
                function(error) {
                    console.log('Failed to FetchTypeForUnit_Parse, with error code: ' + error.message);
                }
            );
        }
    })

    .factory('FetchUnitTypeForMayday_Parse', function (ConvertParseObject) {
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
    .factory('FetchSectorTypeForMayday_Parse', function (ConvertParseObject) {
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
    .factory('FetchActionsForUnit_Parse', function (ConvertParseObject) {
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
    .factory('LoadUnitsForSector_Parse',
    function ($q, ConvertParseObject, FetchTypeForUnit_Parse, FetchActionsForUnit_Parse) {
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
                    promises.push(FetchTypeForUnit_Parse(unit));
                    promises.push(FetchActionsForUnit_Parse(unit));
                }
                return $q.all(promises);
            });
        }
    })
    .factory('LoadSectorsForIncident_Parse',
    function ($q, ConvertParseObject, FetchAcctTypeForSector_Parse, FetchTypeForSector_Parse, LoadUnitsForSector_Parse) {
        return function (incident) {
            var querySectors = new Parse.Query(Parse.Object.extend('Sector'));
            querySectors.equalTo("incident", incident);
            querySectors.include('sectorType');
            return querySectors.find().then(function(sectors){
                incident.sectors = new Array();
                var promises = [];
                for(var i=0; i<sectors.length; i++) {
                    var sector = sectors[i];
                    ConvertParseObject(sector, SECTOR_DEF);
                    incident.sectors.push(sector);
                    promises.push(FetchTypeForSector_Parse(sector));
                    promises.push(LoadUnitsForSector_Parse(sector));
                    promises.push(FetchAcctTypeForSector_Parse(sector));
                }
                return $q.all(promises);
            });
        }
    })
    .factory('LoadAllMaydaysForIncident_Parse',
    function ($q, ConvertParseObject, FetchUnitTypeForMayday_Parse, FetchSectorTypeForMayday_Parse) {
        return function (incident) {
            var queryMaydays = new Parse.Query(Parse.Object.extend('Mayday'));
            queryMaydays.equalTo("incident", incident);
            queryMaydays.include('unitType');
            queryMaydays.include('sectorType');
            return queryMaydays.find().then(function(maydays){
                var promises = [];
                incident.maydays = new Array();
                for(var i=0; i<maydays.length; i++) {
                    var mayday = maydays[i];
                    ConvertParseObject(mayday, MAYDAY_DEF);
                    incident.maydays.push(mayday);
                    promises.push(FetchUnitTypeForMayday_Parse(mayday));
                    promises.push(FetchSectorTypeForMayday_Parse(mayday));
                }
                return $q.all(promises);
            });
        }
    })
    .factory('CreateNewObjectives_Parse', function (ConvertParseObject) {
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
    .factory('FetchObjectivesForIncident_Parse', function (ConvertParseObject, CreateNewObjectives_Parse, UpdateObjectivesPercent) {
        return function (incident) {
            var queryObjectives = new Parse.Query(Parse.Object.extend('Objectives'));
            queryObjectives.equalTo("incident", incident);
            return queryObjectives.first().then(
                function(objectivesObject){
                    if (objectivesObject){
                        ConvertParseObject(objectivesObject, OBJECTIVES_DEF);
                        incident.objectives = objectivesObject;
                    } else {
                        incident.objectives = CreateNewObjectives_Parse(incident);
                    }
                    UpdateObjectivesPercent(incident);
                    return incident;
                }
            );
        }
    })
    .factory('CreateNewOSR_Parse', function (ConvertParseObject) {
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
    .factory('FetchOSRForIncident_Parse', function (ConvertParseObject, CreateNewOSR_Parse, UpdateOsrPercent) {
        return function (incident) {
            var queryOSR = new Parse.Query(Parse.Object.extend('OSR'));
            queryOSR.equalTo("incident", incident);
            return queryOSR.first().then(
                function(osrObject){
                    if (osrObject){
                        ConvertParseObject(osrObject, OSR_DEF);
                        incident.osr = osrObject;
                    } else {
                        incident.osr = CreateNewOSR_Parse(incident);
                    }
                    UpdateOsrPercent(incident);
                    return incident;
                }
            );
        }
    })
    .factory('LoadDispatchedUnitsForIncident_Parse', function ($q, ConvertParseObject, DataStore) {
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
    .factory('LoadIncident_Parse', function (
        $q, ConvertParseObject,
        FetchTypeForIncident_Parse, LoadIAPForIncident_Parse, LoadSectorsForIncident_Parse,
        LoadAllMaydaysForIncident_Parse, FetchObjectivesForIncident_Parse, FetchOSRForIncident_Parse,
        LoadUpgradeForIncident, LoadDispatchedUnitsForIncident_Parse) {
        return function (incidentObjectId) {
            var queryIncident = new Parse.Query(Parse.Object.extend('Incident'));
            queryIncident.equalTo("objectId", incidentObjectId);
            queryIncident.include('incidentType');
            return queryIncident.first().then(function(incident){
                if(incident) {
                    ConvertParseObject(incident, INCIDENT_DEF);

                    var promises = [];
                    promises.push(FetchTypeForIncident_Parse(incident));
                    promises.push(LoadSectorsForIncident_Parse(incident));
                    promises.push(LoadAllMaydaysForIncident_Parse(incident));
                    promises.push(LoadIAPForIncident_Parse(incident));
                    promises.push(FetchObjectivesForIncident_Parse(incident));
                    promises.push(FetchOSRForIncident_Parse(incident));
                    promises.push(LoadUpgradeForIncident(incident));
                    promises.push(LoadDispatchedUnitsForIncident_Parse(incident));
                }
                return $q.all(promises).then(function(bunchOfObjects){
                    // Ignore the bunchOfObjects.  We just want to return the incident:
                    return incident;
                });
            });
        }
    })


    .factory('LoadAllIncidents_Parse',
    function ($q,ConvertParseObject, Incidents, DataStore, FetchTypeForIncident_Parse) {
        return function () {
            var queryIncidents = new Parse.Query(Parse.Object.extend('Incident'));
            return queryIncidents.find().then(function(incidents_qry){
                var incidents = new Array();
                var promises = [];
                for(var i=0; i<incidents_qry.length; i++) {
                    var incident = incidents_qry[i];
                    ConvertParseObject(incident, INCIDENT_DEF);
                    FetchTypeForIncident_Parse(incident);
                    incidents.push(incident);
                }
                return $q.all(promises).then(function(obj){
                    return incidents;
                });
            });
        }
    })



    .factory('LoadIncidentTypes_Parse',
    function (ConvertParseObject, IncidentTypes) {
        return function () {
            var queryIncidentTypes = new Parse.Query(Parse.Object.extend('IncidentType'));
            return queryIncidentTypes.find().then(function(incidentTypes){
                IncidentTypes.removeAll();
                for(var i=0; i<incidentTypes.length; i++) {
                    var incidentType = incidentTypes[i];
                    ConvertParseObject(incidentType, INCIDENT_TYPE_DEF);
                    var nameRefor = incidentType.nameShort.toUpperCase();
                    IncidentTypes.push(incidentType);
                }
                return IncidentTypes;
            });
        }
    })


    .factory('UpdateIncidentAsNeeded_Parse',
    function (DataStore, LoadIncident_Parse) {
        return function () {
            var prevTxId = DataStore.incident.txid;
            DataStore.incident.fetch({
                success:function(incident){
                    if(incident.get('txid')!=prevTxId) {
                        LoadIncident_Parse(incident.id).then(function(incident){
                            DataStore.incident = incident;
                        });
                    }
                },
                error: function(obj, error) {
                    console.log('Failed to create new object, with error code: ' + error.message);
                }
            });
        }
    })
    .factory('UpdateSectorsAsNeeded_Parse',
    function (DataStore, DiffUpdatedTimes_Parse) {
        return function () {
            for(var i=0; i<DataStore.incident.sectors.length; i++) {
                var sector = DataStore.incident.sectors[i];
                var querySectors = new Parse.Query(Parse.Object.extend('Sector'));
                querySectors.equalTo("objectId", sector.id);
                querySectors.first({
                    success: DiffUpdatedTimes_Parse($scope, sector),
                    error: function(error) {
                        console.log('Failed to UpdateSectors, with error code: ' + error.message);
                    }
                });
            }
        }
    })
    .factory('DiffUpdatedTimes_Parse', function (ConvertParseObject, UpdateSector_Parse) {
        return function ($scope, sector) {
            return function(sectorNew) {
                if(sector.updatedAt.getTime()!=sectorNew.updatedAt.getTime()) {
                    sector.fetch({
                        success: UpdateSector_Parse($scope, sector),
                        error: function(error) {
                            console.log('Failed to updateSector, with error code: ' + error.message);
                        }
                    });
                }
            };
        }
    })
    .factory('UpdateSector_Parse',
    function (ConvertParseObject, FetchTypeForSector_Parse, FetchAcctTypeForSector_Parse) {
        return function ($scope, sector) {
            return function(sectorNew) {
//                console.log(sector);
                FetchTypeForSector_Parse($scope, sector);
                FetchAcctTypeForSector_Parse($scope, sector);
            };
        }
    })


    .factory('LoadActionTypes_Parse', ['ActionTypes', 'ParseQuery', 'ConvertParseObject', function (ActionTypes, ParseQuery, ConvertParseObject) {
        return function () {
            var queryActionTypes = new Parse.Query(Parse.Object.extend('ActionType'));
            queryActionTypes.limit(1000);
            return queryActionTypes.find({
                success: function(actionTypes) {
                    for(var i=0; i<actionTypes.length; i++) {
                        var actionType = actionTypes[i];
                        ConvertParseObject(actionType, ACTION_TYPE_DEF);
                        ActionTypes.push(actionType);
                        var nameRefor = actionType.name.toUpperCase();
                        ActionTypes[nameRefor] = actionType;
                    }//for
                },
                error: function(error) {
                    console.log('Failed to LoadActionTypes, with error code: ' + error.message);
                }
            });
        }
    }])

    .factory('LoadSectorTypes_Parse', ['SectorTypes', 'ParseQuery', 'ConvertParseObject', function (SectorTypes, ParseQuery, ConvertParseObject) {
        return function () {
            var querySectorTypes = new Parse.Query(Parse.Object.extend('SectorType'));
            return querySectorTypes.find({
                success: function(sectorTypes) {
                    for(var i=0; i<sectorTypes.length; i++) {
                        var sectorType = sectorTypes[i];
                        ConvertParseObject(sectorType, SECTOR_TYPE_DEF);
                    }//for
                    return sectorType;
                },
                error: function(error) {
                    console.log('Failed to LoadSectorTypes, with error code: ' + error.message);
                }
            });
        }
    }])

    .factory('LoadUnitTypes_Parse', ['UnitTypes', 'ParseQuery', 'ConvertParseObject', function (UnitTypes, ParseQuery, ConvertParseObject) {
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

    .factory('SaveSector_Parse', function (DefaultErrorLogger) {
            return function (sector) {
                return sector.save(null, DefaultErrorLogger);
            }
        })

    .factory('SaveReportAction_Parse', function (DefaultErrorLogger, DataStore) {
            return function (sector, text) {
                var ReportAction = Parse.Object.extend("ReportAction");
                var reportAction = new ReportAction();
                reportAction.set("incident", DataStore.incident);
                reportAction.set("sector", sector);
                reportAction.set("text", text);
                reportAction.save(null, DefaultErrorLogger);
            }
        })

;