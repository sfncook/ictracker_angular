'use strict';

angular.module('AdaptersModule')

    .config(function (AdaptersProvider, DSProvider) {
        AdaptersProvider.addAdapter("dev",
            {
                loginWithDepartment: true,
                hasLogin: true,

                init:function(DS){
                    var adapter = new DSLocalStorageAdapter();
                    DS.registerAdapter('localstorage', adapter, { default: true });
                },

                login: function(username, password) {

                },

                logout: function() {
                }
            }
        );
    })

    .factory('LoadJsonFile', function ($http) {
        return function(modelObj, jsonFileName) {
            return modelObj.findAll().then(
                function(res){
                    if(res.length==0){
                        $http.get(jsonFileName)
                            .then(function(res){
                                for(var i=0; i<res.data.length; i++) {
                                    var obj = res.data[i];
                                    modelObj.create(obj);
                                }
                            });
                    }
                },
                function(error){
                    console.error("DepartmentRes findAll error:", error);
                }
            );
        };
    })

    .run(function (Department, LoadJsonFile) {
        LoadJsonFile(Department, 'data/departments.json');
    })

;