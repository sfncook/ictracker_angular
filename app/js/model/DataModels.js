'use strict';

angular.module("DataModelsModule", ['js-data'])

    .factory('Department', function (DS) {
        return DS.defineResource({
            name: 'Department',
            endpoint: 'classes/Department'
        });
    })

    .factory('Incident', function (DS) {
        return DS.defineResource({
            name: 'Incident',
            endpoint: 'classes/Incident'
        });
    })

    .factory('IncidentType', function (DS) {
        return DS.defineResource({
            name: 'IncidentType',
            endpoint: 'classes/IncidentType'
        });
    })

    .factory('IncidentType', function (DS) {
        return DS.defineResource({
            name: 'IncidentType',
            endpoint: 'classes/IncidentType'
        });
    })

;