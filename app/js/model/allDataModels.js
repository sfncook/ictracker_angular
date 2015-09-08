'use strict';

angular.module("DepartmentModule", ['js-data'])

    .factory('Department', function (DS) {
        return DS.defineResource({
            name: 'Department',
            endpoint: 'classes/Department'
        });
    })

;

angular.module("IncidentModule", ['js-data'])

    .factory('Incident', function (DS) {
        return DS.defineResource({
            name: 'Incident',
            endpoint: 'classes/Incident'
        });
    })
;

angular.module("IncidentTypeModule", ['js-data'])

    .factory('IncidentType', function (DS) {
        return DS.defineResource({
            name: 'IncidentType',
            endpoint: 'classes/IncidentType'
        });
    })

;
