
var app = angular.module("ReportServices", ['DataServices']);

app.factory('reportsSvc', function() {
    var addEvent_title_to_sector;
    return {
        addEvent_title_to_sector: addEvent_title_to_sector
    };
});

app.controller('ReportsDlg', function($scope, DataStore, reportsSvc, DefaultErrorLogger){
    $scope.dataStore = DataStore;
    $scope.events = [];

    reportsSvc.addEvent_title_to_sector = function(sector) {
        $scope.saveActionToReport("Sector initialized: "+sector.sectorType.name);
    }

    reportsSvc.addEvent_unit_to_sector = function(unit, sector) {
        $scope.saveActionToReport("Unit:" + unit.type.name + " added to Sector:" + sector.sectorType.name);
    }

    reportsSvc.addEvent_unit_to_acct = function(unit, sector) {
        $scope.saveActionToReport("Accountability Unit:" + unit.type.name + " added to Sector:" + sector.sectorType.name);
    }

    reportsSvc.addEvent_action_to_unit = function(action, unit, sector) {
        var event = {
            "datetime":new Date(),
            "action":action,
            "unit":unit,
            "sector":sector};

        $scope.events.push(event);
    }

    reportsSvc.addEvent_person_has_par = function(unit, sector) {
        var event = {
            "datetime":new Date(),
            "unit":unit,
            "sector":sector};

        $scope.events.push(event);
    }

    reportsSvc.addEvent_unit_has_par = function(unit, sector) {
        var event = {
            "datetime":new Date(),
            "unit":unit,
            "sector":sector};

        $scope.events.push(event);
    }

    reportsSvc.addEvent_sector_has_par = function(sector) {
        var event = {
            "datetime":new Date(),
            "sector":sector};

        $scope.events.push(event);
    }


    reportsSvc.addEvent_benchmark = function(benchmark) {
        var event = {
            "datetime":new Date(),
            "benchmark":benchmark};

        $scope.events.push(event);
    }

    reportsSvc.addEvent_mode = function(mode) {
        var event = {
            "datetime":new Date(),
            "mode":mode};

        $scope.events.push(event);
    }


    reportsSvc.addEvent_osr = function(osr) {
        var event = {
            "datetime":new Date(),
            "osr":osr};

        $scope.events.push(event);
    }

    reportsSvc.addEvent_objective = function(objective) {
        var event = {
            "datetime":new Date(),
            "objective":objective};

        $scope.events.push(event);
    }

    reportsSvc.addEvent_iap = function(iap) {
        var event = {
            "datetime":new Date(),
            "iap":iap};

        $scope.events.push(event);
    }

    DataStore.showReportsDlg = function() {
        $("#reports_dlg").dialog( "open" );
    }

    $scope.saveActionToReport = function(text) {
        var ReportAction = Parse.Object.extend("ReportAction");
        var reportAction = new ReportAction();
        reportAction.set("text", text);
        reportAction.save(null, DefaultErrorLogger);
    }

});

app.filter('getDateStr', function () {

    return function (dateStr) {
        var date = new Date(dateStr);
        console.log(date);
        return dateStr;
    };
});

app.filter('dateStringForIncident', function () {
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
});

app.filter('timeStringForIncident', function () {
    return function (incident) {
        if(incident.createdAt) {
            var msEpoch = incident.createdAt.getTime();
            var date = new Date(parseInt(msEpoch));
            var hr = date.getHours();
            var hrStr = hr + "";

            var date = new Date(parseInt(msEpoch));
            var min = date.getMinutes();
            var minStr = (min < 10) ? ("0" + min) : min;

            var timeStr = hrStr + ":" + minStr;

            if (hr < 12) {
                timeStr += "AM";
            }

            return timeStr;
        } else {
            return "";
        }
    };
});
