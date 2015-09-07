'use strict';

angular.module("IncidentModule", ['js-data'])

    .factory('Incident', function (DS) {
        return DS.defineResource({
            name: 'Incident',
            endpoint: 'classes/Incident'
        });
    })

;
