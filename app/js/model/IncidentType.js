'use strict';

angular.module("IncidentTypeModule", ['js-data'])

    .factory('IncidentType', function (DS) {
        return DS.defineResource({
            name: 'IncidentType',
            endpoint: 'classes/IncidentType'
        });
    })

;
