
angular.module('ActionServices', ['DataServices', 'AdapterServices'])

    .factory('ActionTypes', function() {
        return new Array();
    })

    .factory('LoadActionTypes', function (AdapterStore) {
        return function () {
            return AdapterStore.adapter.LoadActionTypes();
        }
    })

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

