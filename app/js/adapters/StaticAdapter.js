angular.module('StaticAdapter', [])

    .factory('StaticAdapter', function() {
        return {
            adapter_id_str:'static',
            init:function(){console.log("StaticAdapter init");},
            LoadIncidentTypes: function(){console.log("StaticAdapter LoadIncidentTypes");},
            LoadAllIncidents: function(){console.log("StaticAdapter LoadAllIncidents");},
            LoadIncident: function(){console.log("StaticAdapter LoadIncident");},
            UpdateIncidentAsNeeded: function(){console.log("StaticAdapter UpdateIncidentAsNeeded");}
        };
    })