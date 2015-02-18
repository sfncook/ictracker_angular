
angular.module('IncidentServices', ['ParseServices', 'DataServices'])

    .factory('IncidentTypes', function() {
        return new Array();
    })

    .factory('LoadIncidentTypes', ['IncidentTypes', 'ParseQuery', 'ConvertParseObject', function (IncidentTypes, ParseQuery, ConvertParseObject) {
        return function () {
            var queryIncidentTypes = new Parse.Query(Parse.Object.extend('IncidentType'));
            ParseQuery(queryIncidentTypes, {functionToCall:'find'}).then(function(incidentTypes){
                for(var i=0; i<incidentTypes.length; i++) {
                    var incidentType = incidentTypes[i];
                    ConvertParseObject(incidentType, INCIDENT_TYPE_DEF);
                    IncidentTypes.push(incidentType);
                    var nameRefor = incidentType.nameShort.toUpperCase();
                    IncidentTypes[nameRefor] = incidentType;
                }
            });
        }
    }])

    .factory('LoadIncident', [
        'ConvertParseObject', 'ParseQuery', 'DataStore', 'LoadAllMaydaysForIncident', 'LoadSectorsForIncident',
        function (ConvertParseObject, ParseQuery, DataStore, LoadAllMaydaysForIncident, LoadSectorsForIncident) {
        return function (incidentObjectId, $scope) {
            var queryIncident = new Parse.Query(Parse.Object.extend('Incident'));
            queryIncident.equalTo("objectId", incidentObjectId);
            queryIncident.include('incidentType');
            ParseQuery(queryIncident, {functionToCall:'first'}).then(function(incident){
                if(incident) {
                    ConvertParseObject(incident, INCIDENT_DEF);
                    DataStore.incident = incident;
                    DataStore.incident.incidentType.fetch().then(function(incidentTypeObj){
                        ConvertParseObject(incidentTypeObj, INCIDENT_TYPE_DEF);
                        DataStore.incident.inc_type_obj= incidentTypeObj;
                    });

                    LoadSectorsForIncident($scope, incident);
                    LoadAllMaydaysForIncident($scope, incident);

                    DataStore.loadSuccess = true;
                    DataStore.waitingToLoad = false;

                } else {
                    DataStore.loadSuccess = false;
                    DataStore.waitingToLoad = false;
                }
            });
        }
    }])

    .factory('Incidents', function() {
        return new Array();
    })

    .factory('LoadAllIncidents', ['ConvertParseObject', 'ParseQuery', 'Incidents', function (ConvertParseObject, ParseQuery, Incidents) {
        return function ($scope) {
            var query = new Parse.Query(Parse.Object.extend('Incident'));
            ParseQuery(query, {functionToCall:'find'}).then(function(incidents){
                for(var i=0; i<incidents.length; i++) {
                    var incident = incidents[i];
                    ConvertParseObject(incident, INCIDENT_DEF);
                    fetchTypeForIncident(incident, $scope, ConvertParseObject);
                    Incidents.push(incident);
                }
            });
        }
    }])

;

function fetchTypeForIncident(incident, $scope, ConvertParseObject) {
    var type = incident.incidentType;
    if(type) {
        type.fetch({
            success: function(type) {
                $scope.$apply(function(){
                    ConvertParseObject(type, INCIDENT_TYPE_DEF);
                    incident.incidentType = type;
                });
            }
        });
    }
}

var hourRollOverDone = false;
var t0 = (new Date()).getTime();
window.setInterval(updateIncidentTimer, 1000);
function updateIncidentTimer() {
    var t1 = (new Date()).getTime();
    var elapsed = parseInt(t1 - t0);
    var elapsedSec = parseInt((elapsed / 1000) % 60);
    var elapsedMin = parseInt((elapsed / (1000 * 60)) % 60);
    var elapsedHr = parseInt((elapsed / (1000 * 60 * 60)) % 60);

    var secStr = (elapsedSec < 10) ? ("0" + elapsedSec) : elapsedSec;
    var minStr = (elapsedMin < 10) ? ("0" + elapsedMin) : elapsedMin;
    var hrStr = (elapsedHr < 10) ? ("0" + elapsedHr) : elapsedHr;

    $("#incident_timer").removeClass("font_red");
    $("#incident_timer").removeClass("font_blue");
    $("#incident_timer").removeClass("blink_me");

    if (elapsedMin == 20) {
        $("#incident_timer").addClass("font_blue");
        $("#incident_timer").addClass("blink_me");
    }
    if (elapsedMin == 30) {
        $("#incident_timer").addClass("font_red");
        $("#incident_timer").addClass("blink_me");
    }
    if (elapsedMin == 35) {
        $("#incident_timer").addClass("font_blue");
        $("#incident_timer").addClass("blink_me");
    }

    if (elapsedHr > 0) {
        if (!hourRollOverDone) {
            $("#incident_timer").removeClass("time_lg");
            hourRollOverDone = true;
        }
        $("#incident_timer").html(hrStr + ":" + minStr + ":" + secStr);
    } else {
        $("#incident_timer").html(minStr + ":" + secStr);
    }
}

//$scope.timer_text = "00:00";
//$scope.hourRollOverDone = false;
//var t0 = (new Date()).getTime();
//function updateTimer() {
//    var t1 = (new Date()).getTime();
//    var elapsed = parseInt(t1-t0);
//    var elapsedSec = parseInt((elapsed/1000)%60);
//    var elapsedMin = parseInt((elapsed/(1000*60))%60);
//    var elapsedHr = parseInt((elapsed/(1000*60*60))%60);
//
//    var secStr = (elapsedSec<10)?("0"+elapsedSec):elapsedSec;
//    var minStr = (elapsedMin<10)?("0"+elapsedMin):elapsedMin;
//    var hrStr = (elapsedHr<10)?("0"+elapsedHr):elapsedHr;
//
//    var new_timer_text = "";
//    if (elapsedHr>0) {
//        if (!$scope.hourRollOverDone) {
//            $scope.hourRollOverDone = true;
//        }
//        new_timer_text = hrStr+":"+minStr+":"+secStr;
//    } else {
//        new_timer_text = minStr+":"+secStr;
//    }
//    $scope.timer_text = new_timer_text;
//}
//$interval(updateTimer, 1000);
//
