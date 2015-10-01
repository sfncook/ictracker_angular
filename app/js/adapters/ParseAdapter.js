
angular.module('ParseAdapter', ['IncidentServices'])

    .factory('ParseAdapter', function(LoadIncident) {
        return {
            init:function(){
                if(ENABLE_SERVER_COMM && typeof Parse!='undefined') {
                    var app_key =   localStorage.getItem('app_key');
                    var js_key =    localStorage.getItem('js_key');
                    if(app_key && js_key) {
                        Parse.initialize(app_key, js_key);
                    } else {
                        console.log("app_key and js_key not defined.  Logging out.");
                        Parse.User.logOut();
                    }
                }
            },

            LoadIncident: LoadIncident
        };
    })

;