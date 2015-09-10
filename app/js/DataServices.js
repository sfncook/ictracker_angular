'use strict';

angular.module('DataServices', ['AdaptersModule'])
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

    .factory('initDataStore', ['TbarSectors', function (TbarSectors) {
        return function () {
            TbarSectors.push(newSector);
        }
    }])

;
