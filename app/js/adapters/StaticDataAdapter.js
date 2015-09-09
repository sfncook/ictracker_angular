'use strict';

var StaticAdapter = {
    DS_:null,
    loginWithDepartment: false,
    hasLogin: false,
    objIdFieldName: 'id',
    init:function(DS){
        var adapter = new DSLocalStorageAdapter();
        DS.registerAdapter('localstorage', adapter, { default: true });
    },

    logout: function() {
    }
};

angular.module('AdaptersModule')

    .config(function (AdaptersProvider) {
        AdaptersProvider.addAdapter("dev", StaticAdapter);
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

    .factory('LoadAllJsonData', function (LoadJsonFile, Department, IncidentType, Incident) {
        return function() {
            LoadJsonFile(Department, 'data/departments.json');
            LoadJsonFile(IncidentType, 'data/incidentTypes.json');
            LoadJsonFile(Incident, 'data/incidents.json');
        };
    })

    .run(function (LoadAllJsonData) {
        StaticAdapter.init = LoadAllJsonData;
    })

;