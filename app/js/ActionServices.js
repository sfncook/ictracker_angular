
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

    .factory('LoadActionsForUnit', ['ParseQuery', 'ConvertParseObject', function (ParseQuery, ConvertParseObject) {
        return function ($scope, unit) {
            var relation = unit.relation("actions");
            relation.query().find({
                success: function(actions) {
                    if(!unit.actionsArr) {
                        unit.actionsArr = new Array();
                    }
                    for(var i=0; i<actions.length; i++) {
                        var action = actions[i];
                        ConvertParseObject(action, ACTION_TYPE_DEF);
                        unit.actionsArr.push(action);
                    }
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
                unit.actionsArr.push(actionType);
                addedAction = true;
            }
            unit.save(null, DefaultErrorLogger);
            return addedAction;
        }
    }])

;

