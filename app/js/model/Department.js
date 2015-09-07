'use strict';

angular.module("DepartmentModule", ['js-data', 'AdaptersModule'])

    .factory('Department', function (DS, Adapters) {
        return DS.defineResource({
            name: 'Department',
            endpoint: 'classes/Department'
        });
    })

;
