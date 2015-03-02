
angular.module("ReportServices", ['DataServices'])

    .factory('ReportActions', function() {
        return new Array();
    })

    .factory('LoadReportsForIncident', [
        'ReportActions', 'ConvertParseObject',
        function (ReportActions, ConvertParseObject) {
            return function (incident) {
                var queryReportActions = new Parse.Query(Parse.Object.extend('ReportAction'));
                queryReportActions.equalTo("incident", incident);
                ReportActions.removeAll();
                return queryReportActions.find({
                    success: function(reportActions) {
                        for(var i=0; i<reportActions.length; i++) {
                            var reportAction = reportActions[i];
                            ConvertParseObject(reportAction, REPORT_ACTION_DEF);
                            ReportActions.push(reportAction);
                        }
                    },
                    error: function(error) {
                        console.log('Failed to LoadReportsForIncident, with error code: ' + error.message);
                    }
                });
            }
        }])

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
            LoadReportsForIncident(DataStore.incident).then(function(){
                $("#reports_dlg").dialog( "open" );
            });
        }

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
        };

//        ReportFunctions. = function(sector) {
//            var event = {
//                "datetime":new Date(),
//                "sector":sector};
//
//            $scope.events.push(event);
//        }
//
//
//        ReportFunctions.addEvent_benchmark = function(benchmark) {
//            var event = {
//                "datetime":new Date(),
//                "benchmark":benchmark};
//
//            $scope.events.push(event);
//        }
//
//        ReportFunctions.addEvent_mode = function(mode) {
//            var event = {
//                "datetime":new Date(),
//                "mode":mode};
//
//            $scope.events.push(event);
//        }
//
//
//        ReportFunctions.addEvent_osr = function(osr) {
//            var event = {
//                "datetime":new Date(),
//                "osr":osr};
//
//            $scope.events.push(event);
//        }
//
//        ReportFunctions.addEvent_objective = function(objective) {
//            var event = {
//                "datetime":new Date(),
//                "objective":objective};
//
//            $scope.events.push(event);
//        }
//
//        ReportFunctions.addEvent_iap = function(iap) {
//            var event = {
//                "datetime":new Date(),
//                "iap":iap};
//
//            $scope.events.push(event);
//        }

        }])


;
