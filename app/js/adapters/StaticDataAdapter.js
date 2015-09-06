'use strict';

angular.module('AdaptersModule')

    .config(function (AdaptersProvider, DSProvider) {
        console.log("StaticDataAdapterModule config  AdaptersProvider:", AdaptersProvider);
        AdaptersProvider.addAdapter("dev",
            {
                init:function(){
                    console.log("StaticDataAdapter init  DSProvider.registerAdapter:", DSProvider.registerAdapter);
                    var adapter = new DSLocalStorageAdapter();
                },

                login: function(username, password) {

                },

                logout: function() {
                },

                $get: function () {
                    return {
                        loginWithDepartment: false,
                        hasLogin: false
                    };
                }
            }
        );
    })

;