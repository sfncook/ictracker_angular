angular.module('CacheServices', [])

    .factory('CacheSet', function () {
        return function (key, value) {
            localStorage.setItem(key, value);
        }
    })

;