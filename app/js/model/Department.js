'use strict';

angular.module("DepartmentModule", ['js-data'])

    .factory('Department', function (DS) {
        return DS.defineResource({
            name: 'Department',
            endpoint: 'classes/Department'
        });
    })

;
