
var app = angular.module("ictApp");

var events = [];

app.controller('ReportsDlg', function($scope, dialogSvc){
    $scope.iap_evlc_show = false;
    dialogSvc.showReportsDlg = function() {
        $("#reports_dlg").dialog( "open" );
    }
});


function addEvent_title_to_sector(sector) {
    var event = {
        "datetime":new Date(),
        "sector":sector};

    events.push(event);
}

function addEvent_unit_to_sector(unit, sector) {
    var event = {
        "datetime":new Date(),
        "unit":unit,
        "sector":sector};

    events.push(event);
}

function addEvent_unit_to_acct(unit, sector) {
    var event = {
        "datetime":new Date(),
        "unit":unit,
        "sector":sector};

    events.push(event);
}

function addEvent_action_to_unit(action, unit, sector) {
    var event = {
        "datetime":new Date(),
        "action":action,
        "unit":unit,
        "sector":sector};

    events.push(event);
}

function addEvent_person_has_par(unit, sector) {
    var event = {
        "datetime":new Date(),
        "unit":unit,
        "sector":sector};

    events.push(event);
}

function addEvent_unit_has_par(unit, sector) {
    var event = {
        "datetime":new Date(),
        "unit":unit,
        "sector":sector};

    events.push(event);
}

function addEvent_sector_has_par(sector) {
    var event = {
        "datetime":new Date(),
        "sector":sector};

    events.push(event);
}


function addEvent_benchmark(benchmark) {
    var event = {
        "datetime":new Date(),
        "benchmark":benchmark};

    events.push(event);
}

function addEvent_mode(mode) {
    var event = {
        "datetime":new Date(),
        "mode":mode};

    events.push(event);
}


function addEvent_osr(osr) {
    var event = {
        "datetime":new Date(),
        "osr":osr};

    events.push(event);
}

function addEvent_objective(objective) {
    var event = {
        "datetime":new Date(),
        "objective":objective};

    events.push(event);
}

function addEvent_iap(iap) {
    var event = {
        "datetime":new Date(),
        "iap":iap};

    events.push(event);
}
