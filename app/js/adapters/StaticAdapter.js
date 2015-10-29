angular.module('StaticAdapter', [])

    .factory('StaticAdapter', function(LoadIncidentTypes_Static, isLoggedIn_Static) {
        return {
            adapter_id_str:'static',
            init:function(){console.log("StaticAdapter init");},
            LoadIncidentTypes: LoadIncidentTypes_Static,
            LoadAllIncidents: function(){console.log("StaticAdapter LoadAllIncidents");},
            LoadIncident: function(){console.log("StaticAdapter LoadIncident");},
            UpdateIncidentAsNeeded: function(){console.log("StaticAdapter UpdateIncidentAsNeeded");},
            isLoggedIn: isLoggedIn_Static
        };
    })

    .factory('isLoggedIn_Static', function () {
        return function () {
            return true;
        }
    })

    .factory('LoadIncidentTypes_Static', function ($q) {
        return function () {
            var inc_types = [
                {
                    "type": "fire",
                    "icon": "img/icons/fire.png",
                    "text": "Fire Incident"
                },
                {
                    "type": "medical",
                    "icon": "img/icons/medical.png",
                    "text": "Medical Incident"
                },
                {
                    "hidden": true
                },
                {
                    "type": "arff",
                    "icon": "img/icons/plane.png",
                    "text": "ARFF Incident"
                },
                {
                    "type": "hazmat",
                    "icon": "img/icons/hazmat.png",
                    "text": "HazMat Incident"
                },
                {
                    "type": "water",
                    "icon": "img/icons/water.png",
                    "text": "Water Rescue"
                },
                {
                    "type": "trench",
                    "icon": "img/icons/trench.png",
                    "text": "Trench Rescue"
                },
                {
                    "type": "mountain",
                    "icon": "img/icons/mountain.png",
                    "text": "Mountain Rescue"
                },
                {
                    "type": "palm",
                    "icon": "img/icons/palm.png",
                    "text": "Palm Rescue"
                },
                {
                    "type": "struct",
                    "icon": "img/icons/structure.png",
                    "text": "Structural Rescue"
                },
                {
                    "type": "confined",
                    "icon": "img/icons/confined.png",
                    "text": "Confined Space Rescue"
                }
            ];

            var promise = $q.when(inc_types);
            return promise;
        }
    })
;