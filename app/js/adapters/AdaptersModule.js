'use strict';

function AdaptersConfig() {
    this.loginWithDepartment = false;
}

angular.module('AdaptersModule', ['js-data', 'DepartmentModule', 'IncidentModule', 'IncidentTypeModule', 'DataServices'])

    .run(function (StaticDataAdapter, ParseAdapter, DataStore) {
        var adapterName = getHttpRequestByName('adapter');
        if(adapterName=="dev") {
            DataStore.adapter = StaticDataAdapter;
        } else if(adapterName=="parse") {
            DataStore.adapter = ParseAdapter;
        } else {
            // Default adapter
            DataStore.adapter = ParseAdapter;
        }

        DataStore.adapter.init();
    })

;