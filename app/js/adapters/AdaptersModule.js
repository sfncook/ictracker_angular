'use strict';

function AdaptersConfig() {
    this.loginWithDepartment = false;
}

angular.module('AdaptersModule', ['js-data', 'DepartmentModule', 'IncidentModule', 'IncidentTypeModule'])
    .provider("Adapters", function () {
        var adaptersByName = {};
        var defaultAdapterName;
        return {
            addAdapter: function (adapterName, adapter) {
                adaptersByName[adapterName] = adapter;
            },

            setDefaultAdapterName: function (adapterName) {
                defaultAdapterName = adapterName;
            },

            $get: function () {
                return adaptersByName[defaultAdapterName];
            }
        };
    })

    .config(function (AdaptersProvider) {
        var adapterName = getHttpRequestByName('adapter');
        AdaptersProvider.setDefaultAdapterName(adapterName);
        //console.log("adapterName:",adapterName);
    })

    .run(function (Adapters, DS) {
        Adapters.init(DS);
    })

;