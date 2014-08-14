
var app = angular.module("ictApp");

/**
 * Filters out all duplicate items from an array by checking the specified key
 * @param [items]
 * @param [attr] {string} the name of the attribute of each object to compare for uniqueness
 if the key is empty, the entire object will be compared
 if the key === false then no filtering will be performed
 * @return {array}
 *
 * Example how to use:
 * ng-repeat="unit in catalog_units | unique:'city'"
 */
app.filter('unique', function () {

    return function (items, attr) {

        if (attr === false) {
            console.log('return false');
            return items;
        }

        if ((attr || angular.isUndefined(attr)) && angular.isArray(items)) {
            console.log("testing "+attr);

            var hashCheck = {}, newItems = [];
            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(attr)) {
                    return item[attr];
                } else {
                    return item;
                }
            };
            angular.forEach(items, function (item) {

                var valueToCheck, isDuplicate = false;
                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        } else {
            console.log(angular.isUndefined(attr) +'&&'+ angular.isArray(items));
        }
        return items;
    };
});