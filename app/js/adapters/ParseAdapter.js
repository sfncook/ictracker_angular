
angular.module('ParseAdapter', ['IncidentServices'])

    .factory('ParseAdapter', function(LoadIncident) {
        return {
            init:function(){
                var app_key = localStorage.getItem('department_app_key');
                var js_key = localStorage.getItem('department_js_key');

                if(app_key && js_key) {
                    Parse.initialize(app_key, js_key);
                } else {
                    console.log("app_key and js_key not defined.  Logging out.");
                    Parse.User.logOut();
                }
            },

            LoadIncident: LoadIncident
        };
    })

;