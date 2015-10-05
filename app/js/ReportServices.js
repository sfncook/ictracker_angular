
angular.module("ReportServices", ['DataServices'])

    .factory('ReportActions', function() {
        return new Array();
    })

    .factory('LoadReportsForIncident',
        function (ReportActions, ConvertParseObject) {
            return function ($scope, incident) {
            }
        })
    //.factory('LoadReportsForIncident', [
    //    'ReportActions', 'ConvertParseObject', 'FetchTypeForSector',
    //    function (ReportActions, ConvertParseObject, FetchTypeForSector) {
    //        return function ($scope, incident) {
    //            var queryReportActions = new Parse.Query(Parse.Object.extend('ReportAction'));
    //            queryReportActions.equalTo("incident", incident);
    //            ReportActions.removeAll();
    //            return queryReportActions.find({
    //                success: function(reportActions) {
    //                    for(var i=0; i<reportActions.length; i++) {
    //                        var reportAction = reportActions[i];
    //                        ConvertParseObject(reportAction, REPORT_ACTION_DEF);
    //                        reportAction.sector.fetch({
    //                            success: function(sector) {
    //                                ConvertParseObject(sector, SECTOR_DEF);
    //                                FetchTypeForSector($scope, sector);
    //                                reportAction.sector = sector;
    //                            },
    //                            error: function(error) {
    //                                console.log('Failed to LoadReportsForIncident, with error code: ' + error.message);
    //                            }
    //                        });
    //                        ReportActions.push(reportAction);
    //                    }
    //                },
    //                error: function(error) {
    //                    console.log('Failed to LoadReportsForIncident, with error code: ' + error.message);
    //                }
    //            });
    //        }
    //    }])

    .filter('getDateStr', function () {

        return function (dateStr) {
            var date = new Date(dateStr);
            console.log(date);
            return dateStr;
        };
    })

    .filter('dateStringForIncident', function () {
        return function (incident) {
            if(incident.createdAt) {
                var msEpoch = incident.createdAt.getTime();
                var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
                var dayNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
                var date = new Date(parseInt(msEpoch));
                return dayNames[date.getDay()] + ", " + monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
            } else {
                return "";
            }
        };
    })

    .filter('timeStringForIncident', function () {
        return function (incident) {
            if(incident.createdAt) {
                return incident.createdAt.toLocaleTimeString();
            } else {
                return "";
            }
        };
    })


    .controller('ReportsDlg', function($scope, ReportFunctions, DefaultErrorLogger, LoadReportsForIncident, ReportActions, DataStore){
        $scope.reportActions = ReportActions;
        $scope.dataStore = DataStore;
        $scope.orderByField = "createdBy";

        DataStore.showReportsDlg = function() {
            LoadReportsForIncident($scope, DataStore.incident).then(function(){
                $("#reports_dlg").dialog( "open" );
            });
        }

        $scope.getSectorTypes = function() {
            var sectorsMap = {};
            for(var i=0; i<ReportActions.length; i++) {
                var reportAction = ReportActions[i];
                sectorsMap[reportAction.sector.sectorType.name] = reportAction.sector.sectorType;
            }

            var sectorTypes = new Array();
            for(var i=0; i<Object.keys(sectorsMap).length; i++) {
                var key = Object.keys(sectorsMap)[i];
                sectorTypes.push(sectorsMap[key]);
            }
            return sectorTypes;
        };

        $scope.getReportActionsForSectorType = function(sectorType) {
            var reportActions = new Array();
            for(var i=0; i<ReportActions.length; i++) {
                var reportAction = ReportActions[i];
                if(reportAction.sector.sectorType.name==sectorType.name) {
                    reportActions.push(reportAction);
                }
            }
            return reportActions;
        };

    })

    .factory('SaveReportAction', [
        'DefaultErrorLogger', 'DataStore',
        function (DefaultErrorLogger, DataStore) {
            return function (sector, text) {
                var ReportAction = Parse.Object.extend("ReportAction");
                var reportAction = new ReportAction();
                reportAction.set("incident", DataStore.incident);
                reportAction.set("sector", sector);
                reportAction.set("text", text);
                reportAction.save(null, DefaultErrorLogger);
            }
        }])

    .factory('ReportFunctions', [
        'SaveReportAction',
        function(SaveReportAction) {
            return {
                addEvent_title_to_sector:       function(sector)                        {SaveReportAction(sector, "Sector initialized: "+sector.sectorType.name);},
                addEvent_unit_to_sector:        function(sector, unit)                  {SaveReportAction(sector, "Unit: " + unit.type.name + " added to Sector: " + sector.sectorType.name);},
                addEvent_unitType_to_acct:      function(sector, unitType)              {SaveReportAction(sector, "Accountability Unit: " + unitType.name + " for Sector: " + sector.sectorType.name);},
                addEvent_action_to_unit:        function(sector, unit, actionType)      {SaveReportAction(sector, "Action: " + actionType.name + " Unit:" + unit.type.name + " for Sector: " + sector.sectorType.name);},
                addEvent_sector_has_par:        function(sector)                        {SaveReportAction(sector, "Sector has par - Sector: " + sector.sectorType.name);},
                addEvent_unit_has_par:          function(sector, unit)                  {SaveReportAction(sector, "Unit has par - Unit:" + unit.type.name + " for Sector: " + sector.sectorType.name);},
                addEvent_person_has_par:        function(sector, unit)                  {SaveReportAction(sector, "Fire fighter has par - Unit:" + unit.type.name + " for Sector: " + sector.sectorType.name);},
                addEvent_benchmark:             function(sector, benchmarkText)         {SaveReportAction(sector, "Benchmark:" + benchmarkText + " for Sector: " + sector.sectorType.name);},
                addEvent_osr:                   function(osrText)                       {SaveReportAction(sector, "OSR:" + osrText);},
                addEvent_objective:             function(objectiveText)                 {SaveReportAction(sector, "Objective:" + objectiveText);},
                addEvent_iap:                   function(iapText)                       {SaveReportAction(sector, "IAP:" + iapText);},
            };
        }])


;
