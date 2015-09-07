'use strict';

function AdaptersConfig() {
    this.loginWithDepartment = false;
}

angular.module('AdaptersModule', ['js-data', 'DepartmentModule'])
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
                return {
                    init: function (DS) {
                        adaptersByName[defaultAdapterName].init(DS);
                        this.loginWithDepartment = adaptersByName[defaultAdapterName].loginWithDepartment;
                        this.hasLogin = adaptersByName[defaultAdapterName].hasLogin;
                    }
                };
            }
        };
    })

    .config(function (AdaptersProvider) {
        AdaptersProvider.setDefaultAdapterName(getHttpRequestByName('adapter'));
    })

    .run(function (Adapters, DS) {
        Adapters.init(DS);
    })

;