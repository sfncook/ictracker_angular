
angular.module('ActionServices', ['ParseServices', 'DataServices'])

    .factory('ActionTypes', function() {
        return new Array();
    })

    .factory('LoadActionTypes', ['ActionTypes', 'ParseQuery', 'ConvertParseObject', function (ActionTypes, ParseQuery, ConvertParseObject) {
        return function () {
            var queryActionTypes = new Parse.Query(Parse.Object.extend('ActionType'));
            queryActionTypes.limit(1000);
            return queryActionTypes.find({
                success: function(actionTypes) {
                    for(var i=0; i<actionTypes.length; i++) {
                        var actionType = actionTypes[i];
                        ConvertParseObject(actionType, ACTION_TYPE_DEF);
                        ActionTypes.push(actionType);
                        var nameRefor = actionType.name.toUpperCase();
                        ActionTypes[nameRefor] = actionType;
                    }//for
                },
                error: function(error) {
                    console.log('Failed to LoadActionTypes, with error code: ' + error.message);
                }
            });
        }
    }])

    .factory('ToggleActionTypeForUnit', ['DefaultErrorLogger', function (DefaultErrorLogger) {
        return function (unit, actionType) {
            var addedAction = false;
            var relation = unit.relation("actions");
            if(unit.actionsArr) {
                if(unit.actionsArr.indexOf(actionType)>=0) {
                    relation.remove(actionType);
                    unit.actionsArr.remByVal(actionType);
                    addedAction = false;
                } else {
                    relation.add(actionType);
                    unit.actionsArr.push(actionType);
                    addedAction = true;
                }
            } else {
                // Add unit to sector
                relation.add(actionType);
                if(!unit.actionsArr) {
                    unit.actionsArr = new Array();
                }
                unit.actionsArr.push(actionType);
                addedAction = true;
            }
            unit.save(null, DefaultErrorLogger);
            return addedAction;
        }
    }])

;

