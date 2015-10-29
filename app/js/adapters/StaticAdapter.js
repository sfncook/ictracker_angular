angular.module('StaticAdapter', [])

    .factory('StaticAdapter', function(
        LoadIncidentTypes_Static, LoadAllIncidents_Static, LoadIncident_Static, isLoggedIn_Static,
        LoadActionTypes_Static
    ) {
        return {
            adapter_id_str:'static',
            init:function(){return true;},
            LoadIncidentTypes: LoadIncidentTypes_Static,
            LoadAllIncidents: LoadAllIncidents_Static,
            LoadIncident: LoadIncident_Static,
            UpdateIncidentAsNeeded: function(){console.log("StaticAdapter UpdateIncidentAsNeeded");},
            isLoggedIn: isLoggedIn_Static,
            LoadActionTypes: LoadActionTypes_Static
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

    .factory('LoadActionTypes_Static', function ($q) {
        return function () {
            var promise = $q.when(ACTION_TYPES);
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

var ACTION_TYPES = [
    {"action_type":"Engine", "is_warning":false, "name":"Supply"},
    {"action_type":"Engine", "is_warning":false, "name":"Take a Line"},
    {"action_type":"Engine", "is_warning":false, "name":"Search/Rescue"},
    {"action_type":"Engine", "is_warning":false, "name":"Fire Attack"},
    {"action_type":"Engine", "is_warning":false, "name":"IRIC"},
    {"action_type":"Engine", "is_warning":false, "name":"Check Extension"},
    {"action_type":"Engine", "is_warning":false, "name":"Protect Exposures"},
    {"action_type":"Engine", "is_warning":false, "name":"Overhaul"},
    {"action_type":"Engine", "is_warning":false, "name":"Deck Gun"},
    {"action_type":"Engine", "is_warning":false, "name":"Portable Monitor"},
    {"action_type":"Ladder", "is_warning":false, "name":"Secure Utilities"},
    {"action_type":"Ladder", "is_warning":false, "name":"Vert Ventilation"},
    {"action_type":"Ladder", "is_warning":false, "name":"Trench Cut"},
    {"action_type":"Ladder", "is_warning":false, "name":"Roof Profile"},
    {"action_type":"Ladder", "is_warning":false, "name":"Fan to the Door"},
    {"action_type":"Ladder", "is_warning":false, "name":"Soften Building"},
    {"action_type":"Ladder", "is_warning":false, "name":"Open Building"},
    {"action_type":"Ladder", "is_warning":false, "name":"Salvage"},
    {"action_type":"Ladder", "is_warning":false, "name":"Elevated Master"},
    {"action_type":"Safety", "is_warning":false, "name":"Agrees With Strategy"},
    {"action_type":"Safety", "is_warning":false, "name":"360 recon"},
    {"action_type":"Safety", "is_warning":true, "name":"*Pool"},
    {"action_type":"Safety", "is_warning":true, "name":"*Empty Pool"},
    {"action_type":"Safety", "is_warning":true, "name":"*Powerlines"},
    {"action_type":"Safety", "is_warning":true, "name":"*Powerlines Down"},
    {"action_type":"Safety", "is_warning":true, "name":"*Bars on Windows"},
    {"action_type":"Safety", "is_warning":true, "name":"*Dogs in Yard"},
    {"action_type":"Safety", "is_warning":true, "name":"*Hoarders House"},
    {"action_type":"Safety", "is_warning":true, "name":"*Basement"},
    {"action_type":"Rescue", "is_warning":false, "name":"Grab RIC Bag"},
    {"action_type":"Rescue", "is_warning":false, "name":"Accountability Update"},
    {"action_type":"Rescue", "is_warning":false, "name":"Throw Ladders"},
    {"action_type":"Lines", "is_warning":false, "name":"1-3/4"},
    {"action_type":"Lines", "is_warning":false, "name":"2\""},
    {"action_type":"Lines", "is_warning":false, "name":"2-1/2"},
    {"action_type":"Lines", "is_warning":false, "name":"3\""},
    {"action_type":"Lines", "is_warning":false, "name":"Piercing Nozzle"},
    {"action_type":"Lines", "is_warning":false, "name":"Horizontal Standpipe"},
    {"action_type":"Lines", "is_warning":false, "name":"Support Sprinklers"},
    {"action_type":"Lines", "is_warning":false, "name":"Standpipe"}
]