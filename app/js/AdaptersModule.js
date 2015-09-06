'use strict';

function AdaptersConfig() {
    this.loginWithDepartment = false;
}

angular.module('AdaptersModule', ['js-data'])
    .provider("Adapters", function () {
        var adaptersByName = {};
        var defaultAdapterName;
        return {
            addAdapter: function (adapterName, adapter) {
                console.log("addAdapter");
                adaptersByName[adapterName] = adapter;
            },

            setDefaultAdapterName: function (adapterName) {
                defaultAdapterName = adapterName;
            },

            $get: function () {
                return {
                    init: function () {
                        console.log("Adapters.init()  adaptersByName:", adaptersByName," this:",this, " defaultAdapterName:", defaultAdapterName);
                        adaptersByName[defaultAdapterName].init();
                    }
                };
            }
        };
    })

    .config(function (AdaptersProvider) {
        console.log("AdaptersModule config");
        AdaptersProvider.setDefaultAdapterName(getHttpRequestByName('adapter'));
    })

    .run(function (Adapters) {
        console.log("AdaptersModule run", Adapters);
        Adapters.init();
    })

;