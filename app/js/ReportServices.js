
angular.module("ReportServices", ['ParseServices', 'DataServices'])

    .factory('ReportActions', function() {
        return new Array();
    })

    .factory('LoadReportsForIncident',
        function (ReportActions, ConvertParseObject) {
            return function ($scope, incident) {
            }
        })

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

    .factory('ReportFunctions', function(AdapterStore) {
        return {
            addEvent_title_to_sector:       function(sector)                        {AdapterStore.SaveReportAction(sector, "Sector initialized: "+sector.sectorType.name);},
            addEvent_unit_to_sector:        function(sector, unit)                  {AdapterStore.SaveReportAction(sector, "Unit: " + unit.type.name + " added to Sector: " + sector.sectorType.name);},
            addEvent_unitType_to_acct:      function(sector, unitType)              {AdapterStore.SaveReportAction(sector, "Accountability Unit: " + unitType.name + " for Sector: " + sector.sectorType.name);},
            addEvent_action_to_unit:        function(sector, unit, actionType)      {AdapterStore.SaveReportAction(sector, "Action: " + actionType.name + " Unit:" + unit.type.name + " for Sector: " + sector.sectorType.name);},
            addEvent_sector_has_par:        function(sector)                        {AdapterStore.SaveReportAction(sector, "Sector has par - Sector: " + sector.sectorType.name);},
            addEvent_unit_has_par:          function(sector, unit)                  {AdapterStore.SaveReportAction(sector, "Unit has par - Unit:" + unit.type.name + " for Sector: " + sector.sectorType.name);},
            addEvent_person_has_par:        function(sector, unit)                  {AdapterStore.SaveReportAction(sector, "Fire fighter has par - Unit:" + unit.type.name + " for Sector: " + sector.sectorType.name);},
            addEvent_benchmark:             function(sector, benchmarkText)         {AdapterStore.SaveReportAction(sector, "Benchmark:" + benchmarkText + " for Sector: " + sector.sectorType.name);},
            addEvent_osr:                   function(osrText)                       {AdapterStore.SaveReportAction(sector, "OSR:" + osrText);},
            addEvent_objective:             function(objectiveText)                 {AdapterStore.SaveReportAction(sector, "Objective:" + objectiveText);},
            addEvent_iap:                   function(iapText)                       {AdapterStore.SaveReportAction(sector, "IAP:" + iapText);},
        };
    })


;
