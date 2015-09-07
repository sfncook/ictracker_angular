'use strict';

angular.module('AdaptersModule')

    .config(function (AdaptersProvider) {
        AdaptersProvider.addAdapter("parse",
            {
                DS_:null,
                loginWithDepartment: true,
                hasLogin: true,
                init:function(DS){
                    this.DS_ = DS;
                    var defaults = {};

                    var app_key = localStorage.getItem('department_app_key');
                    var js_key = localStorage.getItem('department_js_key');
                    if(app_key && js_key) {
                        defaults.headers = {
                            'X-Parse-Application-Id' :  app_key,
                            'X-Parse-REST-API-Key' :    js_key
                        };
                    } else {
                        defaults.headers = {
                            'X-Parse-Application-Id' :  'rGT3rpOCdLiXBniennYMpIr77IzzDAlTmGHwy1fO',
                            'X-Parse-REST-API-Key' :    'gmvXdV5g0vFu3VnOR1Dg48oLf6M77uOUMwDfJKJ7'
                        };
                        localStorage.setItem('department_app_key',  defaults.headers.X-Parse-Application-Id);
                        localStorage.setItem('department_js_key',   defaults.headers.X-Parse-REST-API-Key);
                    }
                    defaults.basePath = 'https://api.parse.com/1';
                    defaults.deserialize = function (resourceConfig, data) {
                        if(data.data) {
                            var normalizedObj = data.data;

                            if('results' in normalizedObj) {
                                normalizedObj = normalizedObj.results;
                                for(var i in normalizedObj) {
                                    normalizedObj[i].id = normalizedObj[i].objectId;
                                }
                            } else {
                                normalizedObj.id = normalizedObj.objectId;
                            }

                            return normalizedObj;
                        }
                    };
                    angular.extend(DS.defaults, defaults);
                },

                setDepartment: function(department) {
                    localStorage.setItem('department_app_key', department.app_key);
                    localStorage.setItem('department_js_key', department.js_key);
                    this.DS_.defaults.headers = {
                        'X-Parse-Application-Id' :  department.app_key,
                        'X-Parse-REST-API-Key' :    department.js_key
                    };
                },

                login: function(username, password) {

                },

                logout: function() {
                }
            }
        );
    })

;