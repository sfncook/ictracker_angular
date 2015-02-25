
var app = angular.module("ReportServices", ['DataServices']);

app.factory('reportsSvc', function() {
    var addEvent_title_to_sector;
    return {
        addEvent_title_to_sector: addEvent_title_to_sector
    };
});

app.controller('ReportsDlg', function($scope, DataStore, reportsSvc){
    $scope.dataStore = DataStore;
    $scope.events = [];

    reportsSvc.addEvent_title_to_sector = function(sector) {
        var event = {
            "datetime":new Date(),
            "sector":sector};

        $scope.events.push(event);
    }

    reportsSvc.addEvent_unit_to_sector = function(unit, sector) {
        var event = {
            "datetime":new Date(),
            "unit":unit,
            "sector":sector};

        $scope.events.push(event);
    }

    reportsSvc.addEvent_unit_to_acct = function(unit, sector) {
        var event = {
            "datetime":new Date(),
            "unit":unit,
            "sector":sector};

        $scope.events.push(event);
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
});

app.filter('getDateStr', function () {

    return function (dateStr) {
        var date = new Date(dateStr);
        console.log(date);
        return dateStr;
    };
});
