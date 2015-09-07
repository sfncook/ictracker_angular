'use strict';

angular.module("IncidentModule", ['js-data', 'IncidentTypeModule'])

    .factory('Incident', function (DS, IncidentType) {
        return DS.defineResource({
            name: 'Incident',
            endpoint: 'classes/Incident'
        });
    })
    //
    //.factory('IncidentFind', function (Incident, IncidentType) {
    //    return function(id, options) {
    //        return Incident.find(id, options).then(
    //            function(incident){
    //                console.log("(1) Incident find gFGa4HMohQ success:", incident);
    //                IncidentType.find(incident.incidentType.objectId).then(
    //                    function(incidentType){
    //                        console.log("Incident find IncidentType success:", incidentType);
    //                        incident.incidentType.incidentType = incidentType;
    //                    },
    //                    function(error){
    //                        console.log("Incident find IncidentType error:", error);
    //                    }
    //                )
    //            }
    //        ).then(function(){return incident;});;
    //    };
    //})

;
