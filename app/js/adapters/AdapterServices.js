angular.module('AdapterServices', ['ParseAdapter'])

    .factory('AdapterStore', function(ParseAdapter) {
        return {
            adapter:ParseAdapter
        };
    })

;