
angular.module('ActionServices', ['ParseServices', 'DataServices'])

    .factory('ActionTypes', function() {
        return new Array();
    })

    .factory('LoadActionTypes', ['ActionTypes', 'ParseQuery', 'ConvertParseObject', function (ActionTypes, ParseQuery, ConvertParseObject) {
        return function () {
            var queryActionTypes = new Parse.Query(Parse.Object.extend('ActionType'));
            queryActionTypes.limit(1000);
            return ParseQuery(queryActionTypes, {functionToCall:'find'}).then(function(actionTypes){
                for(var i=0; i<actionTypes.length; i++) {
                    var actionType = actionTypes[i];
                    ConvertParseObject(actionType, ACTION_TYPE_DEF);
                    ActionTypes.push(actionType);
                    var nameRefor = actionType.name.toUpperCase();
                    ActionTypes[nameRefor] = actionType;
                }//for
            });
        }
    }])

;