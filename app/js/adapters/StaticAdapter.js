angular.module('StaticAdapter', [])

    .factory('StaticAdapter', function(LoadIncidentTypes_Static, LoadAllIncidents_Static, LoadIncident_Static, isLoggedIn_Static) {
        return {
            adapter_id_str:'static',
            init:function(){return true;},
            LoadIncidentTypes: LoadIncidentTypes_Static,
            LoadAllIncidents: LoadAllIncidents_Static,
            LoadIncident: LoadIncident_Static,
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
            var promise = $q.when(INC_TYPES);
            return promise;
        }
    })

    .factory('LoadAllIncidents_Static', function ($q) {
        return function () {
            var promise = $q.when(INCIDENTS);
            return promise;
        }
    })

    .factory('LoadIncident_Static', function ($q) {
        return function () {
            console.log("NOTE: You are using the Static Adapter so the inc_id config parameter is ignored.  The same incident data is always returned.");
            var promise = $q.when(INCIDENT);
            return promise;
        }
    })
;


var INC_TYPES = [
    {
        "type": "fire",
        "icon": "img/icons/fire.png",
        "nameLong": "Fire Incident",
        "order":1
    },
    {
        "type": "medical",
        "icon": "img/icons/medical.png",
        "nameLong": "Medical Incident",
        "order":2
    },
    {
        "type": "arff",
        "icon": "img/icons/plane.png",
        "nameLong": "ARFF Incident",
        "order":3
    },
    {
        "type": "hazmat",
        "icon": "img/icons/hazmat.png",
        "nameLong": "HazMat Incident",
        "order":4
    },
    {
        "type": "water",
        "icon": "img/icons/water.png",
        "nameLong": "Water Rescue",
        "order":5
    },
    {
        "type": "trench",
        "icon": "img/icons/trench.png",
        "nameLong": "Trench Rescue",
        "order":6
    },
    {
        "type": "mountain",
        "icon": "img/icons/mountain.png",
        "nameLong": "Mountain Rescue",
        "order":7
    },
    {
        "type": "palm",
        "icon": "img/icons/palm.png",
        "nameLong": "Palm Rescue",
        "order":8
    },
    {
        "type": "struct",
        "icon": "img/icons/structure.png",
        "nameLong": "Structural Rescue",
        "order":9
    },
    {
        "type": "confined",
        "icon": "img/icons/confined.png",
        "nameLong": "Confined Space Rescue",
        "order":10
    }
];

var INCIDENTS = [
    {
        "id":"inc_001_id",
        "inc_number":"inc_001",
        "incidentType": {
            "type": "fire",
            "icon": "img/icons/fire.png",
            "nameLong": "Fire Incident",
            "order":1
        }
    },
    {
        "id":"inc_002_id",
        "inc_number":"inc_002",
        "incidentType": {
            "type": "palm",
            "icon": "img/icons/palm.png",
            "nameLong": "Palm Rescue",
            "order":8
        }
    }
];

var INCIDENT = {
    "id":"inc_001_id",
    "inc_number":"inc_001",
    "incidentType": {
        "type": "fire",
        "icon": "img/icons/fire.png",
        "nameLong": "Fire Incident",
        "order":1
    }
}