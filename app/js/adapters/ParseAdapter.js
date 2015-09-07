'use strict';

var default_app_id =    'rGT3rpOCdLiXBniennYMpIr77IzzDAlTmGHwy1fO';
var default_api_key =   'gmvXdV5g0vFu3VnOR1Dg48oLf6M77uOUMwDfJKJ7';

var ParseAdapter = {
    DS_:null,
        loginWithDepartment: true,
    hasLogin: true,
    init:function(DS){
        this.DS_ = DS;
        var defaults = {};

        var app_key_jsonstr = localStorage.getItem('department_keys');
        if(app_key_jsonstr) {
            defaults.headers = JSON.parse(app_key_jsonstr);
            var parse_current_user_jsonstr = localStorage.getItem('parse_current_user');
            var parse_current_user = JSON.parse(parse_current_user_jsonstr);
            defaults.headers['X-Parse-Session-Token'] = parse_current_user.sessionToken;
        } else {
            defaults.headers = {
                'X-Parse-Application-Id' :  default_app_id,
                'X-Parse-REST-API-Key' :    default_api_key
            };
            localStorage.setItem('department_keys',  JSON.stringify(defaults.headers));
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

    setDepartment: null,
    login: null,
    isLoggedIn: null,

    logout: function() {
    }
};

angular.module('AdaptersModule')

    .config(function (AdaptersProvider) {
        AdaptersProvider.addAdapter("parse", ParseAdapter);
    })

    .run(function (SetDepartment, Login, IsLoggedIn_Parse) {
        ParseAdapter.setDepartment = SetDepartment;
        ParseAdapter.login = Login;
        ParseAdapter.isLoggedIn = IsLoggedIn_Parse;
        //SetDepartment(default_app_id, default_api_key);
        //localStorage.removeItem('parse_current_user');
    })

    .factory('SetDepartment', function (DS) {
        return function (app_key, api_key) {
            var headers = {
                'X-Parse-Application-Id' :  app_key,
                'X-Parse-REST-API-Key' :    api_key
            };
            localStorage.setItem('department_keys',  JSON.stringify(headers));
            DS.defaults.headers = headers;
        }
    })

    .factory('Login', function ($http) {
        return function(username, password) {
            var app_key_jsonstr = localStorage.getItem('department_keys');
            var headers = JSON.parse(app_key_jsonstr);
            headers['X-Parse-Revocable-Session'] = 1;
            var req = {
                method: 'GET',
                url: 'https://api.parse.com/1/login',
                headers : headers,
                params : {
                    username:username,
                    password:password
                }
            };

            return $http(req).then(function(res){
                console.log("login res:",res);
                localStorage.setItem('parse_current_user',  JSON.stringify(res.data));
                var app_key_jsonstr = localStorage.getItem('department_keys');
            });
        }
    })

    .factory('IsLoggedIn_Parse', function () {
        return function () {
            if(localStorage.getItem('parse_current_user')) {
                return true;
            } else {
                return false;
            }
        }
    })

;