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

    .factory('Sector', function (DS) {
        return DS.defineResource({
            name: 'Sector',
            endpoint: 'classes/Sector'
        });
    })

    .factory('SectorType', function (DS) {
        return DS.defineResource({
            name: 'SectorType',
            endpoint: 'classes/SectorType'
        });
    })

    .factory('Iap', function (DS) {
        return DS.defineResource({
            name: 'Iap',
            endpoint: 'classes/Iap'
        });
    })

;