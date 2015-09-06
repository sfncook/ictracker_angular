'use strict';

angular.module('AdaptersModule', ['js-data'])

    .config(function (DSProvider) {
        var Adapters = {};
        Adapters['parse'] = {
            init:function(){
                var defaults = {};
                defaults.basePath = 'https://api.parse.com/1/classes';
                defaults.headers = {
                    'X-Parse-Application-Id' :  'rGT3rpOCdLiXBniennYMpIr77IzzDAlTmGHwy1fO',
                    'X-Parse-REST-API-Key' :    'gmvXdV5g0vFu3VnOR1Dg48oLf6M77uOUMwDfJKJ7'
                };
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
                DSProvider.defaults = defaults;
            }
        };

        Adapters[getHttpRequestByName('adapter')].init();
    })

;