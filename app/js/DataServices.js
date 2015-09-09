'use strict';

angular.module('DataServices', [])
    .factory('DefaultCity', function() {
        return "Mesa";
    })

    .factory('DataStore', function() {
        return {
            incident:{},
            currentUser:{},
            waitingToLoad:true,
            loadSuccess:false
        };
    })

;
