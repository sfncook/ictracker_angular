angular.module('StaticAdapter', [])

    .factory('StaticAdapter', function(
        LoadIncidentTypes_Static, LoadAllIncidents_Static, LoadIncident_Static, isLoggedIn_Static,
        LoadActionTypes_Static, LoadSectorTypes_Static, LoadUnitTypes_Static,
        SaveIncident_Static, SaveSector_Static, SaveReportAction_Static
    ) {
        return {
            adapter_id_str:'static',
            init:function(){return true;},
            LoadIncidentTypes:      LoadIncidentTypes_Static,
            LoadAllIncidents:       LoadAllIncidents_Static,
            LoadIncident:           LoadIncident_Static,
            UpdateIncidentAsNeeded: function(){console.log("StaticAdapter UpdateIncidentAsNeeded");},
            isLoggedIn:             isLoggedIn_Static,
            LoadActionTypes:        LoadActionTypes_Static,
            LoadSectorTypes:        LoadSectorTypes_Static,
            LoadUnitTypes:          LoadUnitTypes_Static,
            SaveIncident:           SaveIncident_Static,
            SaveSector:             SaveSector_Static,
            SaveReportAction:       SaveReportAction_Static
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
            var incident = INCIDENTS[0];
            var sectors = incident.sectors;
            for(var i=0; i<sectors.length; i++) {
                var sector = sectors[i];
                sector.sectorType = SECTOR_TYPES.findObjByName(sector.sectorType.name);
            }

            var promise = $q.when(incident);
            return promise;
        }
    })

    .factory('LoadActionTypes_Static', function ($q) {
        return function () {
            var promise = $q.when(ACTION_TYPES);
            return promise;
        }
    })

    .factory('LoadSectorTypes_Static', function ($q) {
        return function () {
            var promise = $q.when(SECTOR_TYPES);
            return promise;
        }
    })

    .factory('LoadUnitTypes_Static', function ($q) {
        return function () {
            var promise = $q.when(UNIT_TYPES);
            return promise;
        }
    })

    .factory('SaveIncident_Static', function ($q) {
        return function (incident) {
            console.log("SaveIncident_Static - Do nothing.  Always returns TRUE.");
            var promise = $q.when(true);
            return promise;
        }
    })

    .factory('SaveSector_Static', function ($q) {
        return function (sector) {
            console.log("SaveSector_Static - Do nothing.  Always returns TRUE.");
            var promise = $q.when(true);
            return promise;
        }
    })

    .factory('SaveReportAction_Static', function ($q) {
        return function (sector, text) {
            console.log("SaveReportAction_Static - Do nothing.  Always returns TRUE.");
            var promise = $q.when(true);
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
        "inc_address":"100 W. Main St",
        "incidentType": {
            "type": "fire",
            "icon": "img/icons/fire.png",
            "nameLong": "Fire Incident",
            "order":1
        },
        "sectors":[
            {"col": 3,"id": "rwjawwLK6o","row": 0,"sectorType": {"name":"Sector 1"}, "units":[] },
            {"col": 3,"id": "XH3meqm1L9","row": 0,"sectorType": {"name":"Sector 2"}, "units":[] },
            {"col": 3,"id": "r29PW2kZwX","row": 2,"sectorType": {"name":"Sector 3"}, "units":[] },
            {"col": 2,"id": "3Jh3oHnTTJ","row": 0,"sectorType": {"name":"Sector 4"}, "units":[] },
            {"col": 2,"id": "f7YzFHsKzC","row": 1,"sectorType": {"name":"Sector 5"}, "units":[] },
            {"col": 1,"id": "0H5sKys9x1","row": 0,"sectorType": {"name":"Sector 6"}, "units":[] },
            {"col": 2,"id": "tzqwpCLfY2","row": 2,"sectorType": {"name":"Sector 7"}, "units":[] },
            {"col": 0,"id": "sITyWAb5ex","row": 0,"sectorType": {"name":"Sector 8"}, "units":[] },
            {"col": 0,"id": "F0HEuGoQNF","row": 1,"sectorType": {"name":"Sector 9"}, "units":[] },
            {"col": 0,"id": "2mAQPFlG0w","row": 0,"sectorType": {"name":"Alpha Sector"}, "units":[] },
            {"col": 1,"id": "2l1uDY4sV7","row": 0,"sectorType": {"name":"Bravo Sector"}, "units":[] },
            {"col": 1,"id": "2l1uDY4sV7","row": 2,"sectorType": {"name":"Charlie Sector"}, "units":[] }
        ]

    },
    {
        "id":"inc_002_id",
        "inc_number":"inc_002",
        "inc_address":"200 W. Broadway Ave",
        "incidentType": {
            "type": "palm",
            "icon": "img/icons/palm.png",
            "nameLong": "Palm Rescue",
            "order":8
        }
    }
];


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

var SECTOR_TYPES = [
    {"name":"Interior",         "hasClock":true,    "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":4,  "hasClassicBnch":true,  "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Ventilation",      "hasClock":true,    "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":4,  "hasClassicBnch":false, "hasVentBnch":true,     "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Roof",             "hasClock":true,    "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":4,  "hasClassicBnch":false, "hasVentBnch":true,     "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"On Deck",          "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Staging",          "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"IRIC",             "hasClock":true,    "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":4,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":true,     "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"RIC",              "hasClock":true,    "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":4,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":true,     "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"RESCUE",           "hasClock":true,    "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":4,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":true,     "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Safety",           "hasClock":true,    "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":2,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":true,   "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Delta Sector",     "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Overhaul",         "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Medical",          "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Salvage",          "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Sector 1",         "hasClock":true,    "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":4,  "hasClassicBnch":true,  "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Sector 2",         "hasClock":true,    "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":4,  "hasClassicBnch":true,  "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Sector 3",         "hasClock":true,    "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":4,  "hasClassicBnch":true,  "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Sector 4",         "hasClock":true,    "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":4,  "hasClassicBnch":true,  "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Sector 5",         "hasClock":true,    "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":4,  "hasClassicBnch":true,  "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Sector 6",         "hasClock":true,    "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":4,  "hasClassicBnch":true,  "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Sector 7",         "hasClock":true,    "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":4,  "hasClassicBnch":true,  "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Sector 8",         "hasClock":true,    "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":4,  "hasClassicBnch":true,  "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Sector 9",         "hasClock":true,    "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":4,  "hasClassicBnch":true,  "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Sector ####",      "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Alpha Sector",     "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Bravo Sector",     "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Charlie Sector",   "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Delta Sector",     "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"North Sector",     "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":4,  "hasClassicBnch":true,  "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"East Sector",      "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":4,  "hasClassicBnch":true,  "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"South Sector",     "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":4,  "hasClassicBnch":true,  "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"West Sector",      "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":4,  "hasClassicBnch":true,  "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Salvage",          "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Overhaul",         "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Evacuation",       "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Customer Service", "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"ReHab",            "hasClock":false,   "hasAcctBtn":false, "hasPsiBtn":false,  "hasActions":false ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Lobby",            "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Resource",         "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Accountability",   "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Triage",           "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":3,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":true    },
    {"name":"Extrication",      "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Treatment",        "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":3,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":true,    "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Transportation",   "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
    {"name":"Lz",               "hasClock":false,   "hasAcctBtn":true,  "hasPsiBtn":true,   "hasActions":true  ,"isVisible":true,   "manyBenchmarkBars":0,  "hasClassicBnch":false, "hasVentBnch":false,    "hasIricBnch":false,    "hasSafetyBnch":false,  "hasTreatmentBnch":false,   "hasLzBnch":false,  "hasTriageBnch":false   },
]

var UNIT_TYPES = [
    {"city":"Chandler", "type":"Engine", "name":"E282"},
    {"city":"Chandler", "type":"Engine", "name":"E283"},
    {"city":"Chandler", "type":"Engine", "name":"E284"},
    {"city":"Chandler", "type":"Engine", "name":"E285"},
    {"city":"Chandler", "type":"Engine", "name":"E286"},
    {"city":"Chandler", "type":"Engine", "name":"E287"},
    {"city":"Chandler", "type":"Engine", "name":"E288"},
    {"city":"Chandler", "type":"Engine", "name":"E289"},
    {"city":"Chandler", "type":"Engine", "name":"E2810"},
    {"city":"Chandler", "type":"Engine", "name":"E2282"},
    {"city":"Chandler", "type":"Ladder", "name":"L281"},
    {"city":"Chandler", "type":"Ladder", "name":"L283"},
    {"city":"Chandler", "type":"Ladder", "name":"Lt281"},
    {"city":"Chandler", "type":"Ladder", "name":"Lt283"},
    {"city":"Chandler", "type":"BC", "name":"BC281"},
    {"city":"Chandler", "type":"BC", "name":"BC282"},
    {"city":"Chandler", "type":"BC", "name":"BSO281"},
    {"city":"Chandler", "type":"BC", "name":"BSO282"},
    {"city":"Chandler", "type":"Squad", "name":"SQ283"},
    {"city":"Chandler", "type":"HazMat", "name":"HM283"},
    {"city":"Chandler", "type":"Util", "name":"U288"},
    {"city":"Chandler", "type":"Brush", "name":"Br284"},
    {"city":"Chandler", "type":"Ambo", "name":"Ambo"},
    {"city":"Chandler", "type":"AirVac", "name":"Native Air"},
    {"city":"Chandler", "type":"AirVac", "name":"Life Net"},
    {"city":"Chandler", "type":"AirVac", "name":"Ranger 41"},

    {"city":"Gilbert", "type":"Engine", "name":"E251"},
    {"city":"Gilbert", "type":"Engine", "name":"E252"},
    {"city":"Gilbert", "type":"Engine", "name":"E254"},
    {"city":"Gilbert", "type":"Engine", "name":"E256"},
    {"city":"Gilbert", "type":"Engine", "name":"E257"},
    {"city":"Gilbert", "type":"Engine", "name":"E258"},
    {"city":"Gilbert", "type":"Engine", "name":"E2510"},
    {"city":"Gilbert", "type":"Engine", "name":"E2511"},
    {"city":"Gilbert", "type":"Engine", "name":"E2540"},
    {"city":"Gilbert", "type":"Ladder", "name":"L210"},
    {"city":"Gilbert", "type":"Ladder", "name":"L251"},
    {"city":"Gilbert", "type":"Ladder", "name":"L253"},
    {"city":"Gilbert", "type":"Ladder", "name":"L255"},
    {"city":"Gilbert", "type":"Ladder", "name":"Lt251"},
    {"city":"Gilbert", "type":"Ladder", "name":"Lt253"},
    {"city":"Gilbert", "type":"Ladder", "name":"Lt255"},
    {"city":"Gilbert", "type":"BC", "name":"BC251"},
    {"city":"Gilbert", "type":"BC", "name":"BC252"},
    {"city":"Gilbert", "type":"BC", "name":"BSO251"},
    {"city":"Gilbert", "type":"BC", "name":"BSO252"},
    {"city":"Gilbert", "type":"Util", "name":"U251"},
    {"city":"Gilbert", "type":"CV", "name":"CV251"},
    {"city":"Gilbert", "type":"WtrTend", "name":"WT256"},
    {"city":"Gilbert", "type":"WtrTend", "name":"WT2511"},
    {"city":"Gilbert", "type":"HazMat", "name":"HM258"},
    {"city":"Gilbert", "type":"Brush", "name":"Br2511"},
    {"city":"Gilbert", "type":"Ambo", "name":"SWA251"},
    {"city":"Gilbert", "type":"Ambo", "name":"SWA252"},
    {"city":"Gilbert", "type":"Ambo", "name":"SWA253"},
    {"city":"Gilbert", "type":"Ambo", "name":"SWA255"},
    {"city":"Gilbert", "type":"AirVac", "name":"Native Air"},
    {"city":"Gilbert", "type":"AirVac", "name":"Life Net"},
    {"city":"Gilbert", "type":"AirVac", "name":"Ranger 41"},

    {"city":"Mesa", "type":"Engine", "name":"E201", "default":"1"},
    {"city":"Mesa", "type":"Engine", "name":"E202"},
    {"city":"Mesa", "type":"Engine", "name":"E203"},
    {"city":"Mesa", "type":"Engine", "name":"E204"},
    {"city":"Mesa", "type":"Engine", "name":"E205"},
    {"city":"Mesa", "type":"Engine", "name":"E206"},
    {"city":"Mesa", "type":"Engine", "name":"E207"},
    {"city":"Mesa", "type":"Engine", "name":"E208"},
    {"city":"Mesa", "type":"Engine", "name":"E209"},
    {"city":"Mesa", "type":"Engine", "name":"E210"},
    {"city":"Mesa", "type":"Engine", "name":"E211"},
    {"city":"Mesa", "type":"Engine", "name":"E212"},
    {"city":"Mesa", "type":"Engine", "name":"E213"},
    {"city":"Mesa", "type":"Engine", "name":"E215"},
    {"city":"Mesa", "type":"Engine", "name":"E216"},
    {"city":"Mesa", "type":"Engine", "name":"E217"},
    {"city":"Mesa", "type":"Engine", "name":"E218"},
    {"city":"Mesa", "type":"Engine", "name":"E219"},
    {"city":"Mesa", "type":"Engine", "name":"E220"},
    {"city":"Mesa", "type":"Engine", "name":"E221"},
    {"city":"Mesa", "type":"Engine", "name":"E222"},
    {"city":"Mesa", "type":"Engine", "name":"E223"},
    {"city":"Mesa", "type":"Engine", "name":"E224"},
    {"city":"Mesa", "type":"Engine", "name":"E225"},
    {"city":"Mesa", "type":"Engine", "name":"E226"},
    {"city":"Mesa", "type":"Engine", "name":"E227"},
    {"city":"Mesa", "type":"Engine", "name":"E228"},
    {"city":"Mesa", "type":"Engine", "name":"E229"},
    {"city":"Mesa", "type":"Ladder", "name":"L201"},
    {"city":"Mesa", "type":"Ladder", "name":"L204"},
    {"city":"Mesa", "type":"Ladder", "name":"L206"},
    {"city":"Mesa", "type":"Ladder", "name":"L209"},
    {"city":"Mesa", "type":"Ladder", "name":"L214"},
    {"city":"Mesa", "type":"Ladder", "name":"L220"},
    {"city":"Mesa", "type":"Ladder", "name":"Lt201"},
    {"city":"Mesa", "type":"Ladder", "name":"Lt204"},
    {"city":"Mesa", "type":"Ladder", "name":"Lt206"},
    {"city":"Mesa", "type":"Ladder", "name":"Lt209"},
    {"city":"Mesa", "type":"Ladder", "name":"Lt214"},
    {"city":"Mesa", "type":"Ladder", "name":"Lt220"},
    {"city":"Mesa", "type":"BC", "name":"ED200"},
    {"city":"Mesa", "type":"BC", "name":"BC201"},
    {"city":"Mesa", "type":"BC", "name":"BC202"},
    {"city":"Mesa", "type":"BC", "name":"BC203"},
    {"city":"Mesa", "type":"BC", "name":"BSO200"},
    {"city":"Mesa", "type":"BC", "name":"BSO201"},
    {"city":"Mesa", "type":"BC", "name":"BSO202"},
    {"city":"Mesa", "type":"BC", "name":"BSO203"},
    {"city":"Mesa", "type":"Squad", "name":"SQ204"},
    {"city":"Mesa", "type":"Squad", "name":"SQ206"},
    {"city":"Mesa", "type":"ScnSup", "name":"SS208"},
    {"city":"Mesa", "type":"WtrTend", "name":"WT213"},
    {"city":"Mesa", "type":"Brush", "name":"Br212"},
    {"city":"Mesa", "type":"Brush", "name":"Br214"},
    {"city":"Mesa", "type":"Brush", "name":"Br216"},
    {"city":"Mesa", "type":"Brush", "name":"Br219"},
    {"city":"Mesa", "type":"Foam", "name":"FO21"},
    {"city":"Mesa", "type":"Foam", "name":"FO22"},
    {"city":"Mesa", "type":"Foam", "name":"FO23"},
    {"city":"Mesa", "type":"Con", "name":"Con201"},
    {"city":"Mesa", "type":"Con", "name":"Con202"},
    {"city":"Mesa", "type":"Con", "name":"Con203"},
    {"city":"Mesa", "type":"Util", "name":"U202"},
    {"city":"Mesa", "type":"CV", "name":"CV201"},
    {"city":"Mesa", "type":"HazMat", "name":"HM206"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA201"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA202"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA203"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA204"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA205"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA206"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA207"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA208"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA209"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA210"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA211"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA212"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA220"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA221"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA222"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA223"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA224"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA225"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA226"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA227"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA228"},
    {"city":"Mesa", "type":"Ambo", "name":"SWA229"},
    {"city":"Mesa", "type":"AirVac", "name":"Native Air"},
    {"city":"Mesa", "type":"AirVac", "name":"Life Net"},
    {"city":"Mesa", "type":"AirVac", "name":"Ranger 41"},

    {"city":"QC", "type":"Engine", "name":"E411"},
    {"city":"QC", "type":"Engine", "name":"E412"},
    {"city":"QC", "type":"BC", "name":"BC411"},
    {"city":"QC", "type":"BC", "name":"BSO411"},
    {"city":"QC", "type":"Ambo", "name":"SWA411"},
    {"city":"QC", "type":"AirVac", "name":"Native Air"},
    {"city":"QC", "type":"AirVac", "name":"Life Net"},
    {"city":"QC", "type":"AirVac", "name":"Ranger 41"},

    {"city":"Phoenix", "type":"Engine", "name":"E1"},
    {"city":"Phoenix", "type":"Engine", "name":"E3"},
    {"city":"Phoenix", "type":"Engine", "name":"E4"},
    {"city":"Phoenix", "type":"Engine", "name":"E5"},
    {"city":"Phoenix", "type":"Engine", "name":"E6"},
    {"city":"Phoenix", "type":"Engine", "name":"E7"},
    {"city":"Phoenix", "type":"Engine", "name":"E8"},
    {"city":"Phoenix", "type":"Engine", "name":"E9"},
    {"city":"Phoenix", "type":"Engine", "name":"E10"},
    {"city":"Phoenix", "type":"Engine", "name":"E11"},
    {"city":"Phoenix", "type":"Engine", "name":"E12"},
    {"city":"Phoenix", "type":"Engine", "name":"E13"},
    {"city":"Phoenix", "type":"Engine", "name":"E14"},
    {"city":"Phoenix", "type":"Engine", "name":"E15"},
    {"city":"Phoenix", "type":"Engine", "name":"E16"},
    {"city":"Phoenix", "type":"Engine", "name":"E17"},
    {"city":"Phoenix", "type":"Engine", "name":"E18"},
    {"city":"Phoenix", "type":"Engine", "name":"E19"},
    {"city":"Phoenix", "type":"Engine", "name":"E20"},
    {"city":"Phoenix", "type":"Engine", "name":"E21"},
    {"city":"Phoenix", "type":"Engine", "name":"E22"},
    {"city":"Phoenix", "type":"Engine", "name":"E23"},
    {"city":"Phoenix", "type":"Engine", "name":"E24"},
    {"city":"Phoenix", "type":"Engine", "name":"E25"},
    {"city":"Phoenix", "type":"Engine", "name":"E26"},
    {"city":"Phoenix", "type":"Engine", "name":"E27"},
    {"city":"Phoenix", "type":"Engine", "name":"E28"},
    {"city":"Phoenix", "type":"Engine", "name":"E29"},
    {"city":"Phoenix", "type":"Engine", "name":"E30"},
    {"city":"Phoenix", "type":"Engine", "name":"E31"},
    {"city":"Phoenix", "type":"Engine", "name":"E32"},
    {"city":"Phoenix", "type":"Engine", "name":"E33"},
    {"city":"Phoenix", "type":"Engine", "name":"E34"},
    {"city":"Phoenix", "type":"Engine", "name":"E35"},
    {"city":"Phoenix", "type":"Engine", "name":"E36"},
    {"city":"Phoenix", "type":"Engine", "name":"E37"},
    {"city":"Phoenix", "type":"Engine", "name":"E38"},
    {"city":"Phoenix", "type":"Engine", "name":"E39"},
    {"city":"Phoenix", "type":"Engine", "name":"E40"},
    {"city":"Phoenix", "type":"Engine", "name":"E41"},
    {"city":"Phoenix", "type":"Engine", "name":"E42"},
    {"city":"Phoenix", "type":"Engine", "name":"E43"},
    {"city":"Phoenix", "type":"Engine", "name":"E44"},
    {"city":"Phoenix", "type":"Engine", "name":"E45"},
    {"city":"Phoenix", "type":"Engine", "name":"E46"},
    {"city":"Phoenix", "type":"Engine", "name":"E48"},
    {"city":"Phoenix", "type":"Engine", "name":"E49"},
    {"city":"Phoenix", "type":"Engine", "name":"E50"},
    {"city":"Phoenix", "type":"Engine", "name":"E52"},
    {"city":"Phoenix", "type":"Engine", "name":"E54"},
    {"city":"Phoenix", "type":"Engine", "name":"E56"},
    {"city":"Phoenix", "type":"Engine", "name":"E57"},
    {"city":"Phoenix", "type":"Engine", "name":"E58"},
    {"city":"Phoenix", "type":"Engine", "name":"E59"},
    {"city":"Phoenix", "type":"Engine", "name":"E60"},
    {"city":"Phoenix", "type":"Engine", "name":"E61"},
    {"city":"Phoenix", "type":"Engine", "name":"E72"},
    {"city":"Phoenix", "type":"Engine", "name":"E905"},
    {"city":"Phoenix", "type":"Engine", "name":"E910"},
    {"city":"Phoenix", "type":"Engine", "name":"E918"},
    {"city":"Phoenix", "type":"Engine", "name":"E925"},
    {"city":"Phoenix", "type":"Engine", "name":"E929"},
    {"city":"Phoenix", "type":"Engine", "name":"E930"},
    {"city":"Phoenix", "type":"Engine", "name":"E935"},
    {"city":"Phoenix", "type":"Engine", "name":"E960"},
    {"city":"Phoenix", "type":"Ladder", "name":"L1"},
    {"city":"Phoenix", "type":"Ladder", "name":"L4"},
    {"city":"Phoenix", "type":"Ladder", "name":"L9"},
    {"city":"Phoenix", "type":"Ladder", "name":"L11"},
    {"city":"Phoenix", "type":"Ladder", "name":"L12"},
    {"city":"Phoenix", "type":"Ladder", "name":"L20"},
    {"city":"Phoenix", "type":"Ladder", "name":"L22"},
    {"city":"Phoenix", "type":"Ladder", "name":"L24"},
    {"city":"Phoenix", "type":"Ladder", "name":"L26"},
    {"city":"Phoenix", "type":"Ladder", "name":"L33"},
    {"city":"Phoenix", "type":"Ladder", "name":"L37"},
    {"city":"Phoenix", "type":"Ladder", "name":"L41"},
    {"city":"Phoenix", "type":"Ladder", "name":"L43"},
    {"city":"Phoenix", "type":"Ladder", "name":"L50"},
    {"city":"Phoenix", "type":"Ladder", "name":"Lt1"},
    {"city":"Phoenix", "type":"Ladder", "name":"Lt4"},
    {"city":"Phoenix", "type":"Ladder", "name":"Lt9"},
    {"city":"Phoenix", "type":"Ladder", "name":"Lt11"},
    {"city":"Phoenix", "type":"Ladder", "name":"Lt12"},
    {"city":"Phoenix", "type":"Ladder", "name":"Lt20"},
    {"city":"Phoenix", "type":"Ladder", "name":"Lt22"},
    {"city":"Phoenix", "type":"Ladder", "name":"Lt24"},
    {"city":"Phoenix", "type":"Ladder", "name":"Lt26"},
    {"city":"Phoenix", "type":"Ladder", "name":"Lt33"},
    {"city":"Phoenix", "type":"Ladder", "name":"Lt37"},
    {"city":"Phoenix", "type":"Ladder", "name":"Lt41"},
    {"city":"Phoenix", "type":"Ladder", "name":"Lt43"},
    {"city":"Phoenix", "type":"Ladder", "name":"Lt50"},
    {"city":"Phoenix", "type":"BC", "name":"BC1"},
    {"city":"Phoenix", "type":"BC", "name":"BC2"},
    {"city":"Phoenix", "type":"BC", "name":"BC3"},
    {"city":"Phoenix", "type":"BC", "name":"BC4"},
    {"city":"Phoenix", "type":"BC", "name":"BC5"},
    {"city":"Phoenix", "type":"BC", "name":"BC6"},
    {"city":"Phoenix", "type":"BC", "name":"BC8"},
    {"city":"Phoenix", "type":"BC", "name":"BC19"},
    {"city":"Phoenix", "type":"BC", "name":"No Dep"},
    {"city":"Phoenix", "type":"BC", "name":"So Dep"},
    {"city":"Phoenix", "type":"BC", "name":"BSO1"},
    {"city":"Phoenix", "type":"BC", "name":"BSO2"},
    {"city":"Phoenix", "type":"BC", "name":"BSO3"},
    {"city":"Phoenix", "type":"BC", "name":"BSO4"},
    {"city":"Phoenix", "type":"BC", "name":"BSO5"},
    {"city":"Phoenix", "type":"BC", "name":"BSO6"},
    {"city":"Phoenix", "type":"BC", "name":"BSO8"},
    {"city":"Phoenix", "type":"BC", "name":"BSO19"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES3"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES5"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES7"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES8"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES9"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES11"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES12"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES13"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES15"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES16"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES17"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES18"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES21"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES22"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES25"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES26"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES27"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES28"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES29"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES30"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES31"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES32"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES33"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES34"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES35"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES36"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES38"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES40"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES42"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES43"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES45"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES50"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES60"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES918"},
    {"city":"Phoenix", "type":"Ambo", "name":"RES942"},
    {"city":"Phoenix", "type":"Brush", "name":"BT23"},
    {"city":"Phoenix", "type":"Brush", "name":"BT28"},
    {"city":"Phoenix", "type":"Brush", "name":"BT33"},
    {"city":"Phoenix", "type":"Brush", "name":"BT35"},
    {"city":"Phoenix", "type":"Brush", "name":"BT36"},
    {"city":"Phoenix", "type":"Brush", "name":"BT45"},
    {"city":"Phoenix", "type":"Brush", "name":"BT46"},
    {"city":"Phoenix", "type":"Brush", "name":"BT48"},
    {"city":"Phoenix", "type":"Brush", "name":"BT49"},
    {"city":"Phoenix", "type":"Brush", "name":"BT52"},
    {"city":"Phoenix", "type":"Brush", "name":"BT56"},
    {"city":"Phoenix", "type":"Brush", "name":"BT57"},
    {"city":"Phoenix", "type":"Brush", "name":"BT58"},
    {"city":"Phoenix", "type":"HazMat", "name":"HM4"},
    {"city":"Phoenix", "type":"HazMat", "name":"HM38"},
    {"city":"Phoenix", "type":"HazMat", "name":"HM41"},
    {"city":"Phoenix", "type":"Util", "name":"U10"},
    {"city":"Phoenix", "type":"Util", "name":"U29"},
    {"city":"Phoenix", "type":"Util", "name":"U50"},
    {"city":"Phoenix", "type":"Squad", "name":"SQ8"},
    {"city":"Phoenix", "type":"Squad", "name":"SQ44"},
    {"city":"Phoenix", "type":"Squad", "name":"SQ72"},
    {"city":"Phoenix", "type":"SupVeh", "name":"SV8"},
    {"city":"Phoenix", "type":"SupVeh", "name":"SV12"},
    {"city":"Phoenix", "type":"SupVeh", "name":"SV45"},
    {"city":"Phoenix", "type":"Foam", "name":"Foam1"},
    {"city":"Phoenix", "type":"Foam", "name":"Foam2"},
    {"city":"Phoenix", "type":"Foam", "name":"Foam3"},
    {"city":"Phoenix", "type":"Foam", "name":"Foam34"},
    {"city":"Phoenix", "type":"Foam", "name":"Foam44"},
    {"city":"Phoenix", "type":"WtrTend", "name":"WT23"},
    {"city":"Phoenix", "type":"WtrTend", "name":"WT36"},
    {"city":"Phoenix", "type":"WtrTend", "name":"WT52"},
    {"city":"Phoenix", "type":"WtrTend", "name":"WT54"},
    {"city":"Phoenix", "type":"WtrTend", "name":"WT56"},
    {"city":"Phoenix", "type":"WtrTend", "name":"WT58"},
    {"city":"Phoenix", "type":"CV", "name":"CV1"},
    {"city":"Phoenix", "type":"CV", "name":"CV2"},
    {"city":"Phoenix", "type":"Hose", "name":"Hose34"},
    {"city":"Phoenix", "type":"Hose", "name":"Hose58"},
    {"city":"Phoenix", "type":"Vent", "name":"Vent3"},
    {"city":"Phoenix", "type":"Crisis", "name":"Cris16"},
    {"city":"Phoenix", "type":"HighRise", "name":"HiRi1"},
    {"city":"Phoenix", "type":"PIO", "name":"PI3"},
    {"city":"Phoenix", "type":"Attack", "name":"Att19"},
    {"city":"Phoenix", "type":"AirVac", "name":"Native Air"},
    {"city":"Phoenix", "type":"AirVac", "name":"Life Net"},
    {"city":"Phoenix", "type":"AirVac", "name":"Ranger 41"},

    {"city":"Suprstion", "type":"Engine", "name":"E261"},
    {"city":"Suprstion", "type":"Engine", "name":"E262"},
    {"city":"Suprstion", "type":"Engine", "name":"E265"},
    {"city":"Suprstion", "type":"Ladder", "name":"L263"},
    {"city":"Suprstion", "type":"Ladder", "name":"L264"},
    {"city":"Suprstion", "type":"Ladder", "name":"Lt263"},
    {"city":"Suprstion", "type":"Ladder", "name":"Lt264"},
    {"city":"Suprstion", "type":"BC", "name":"BC261"},
    {"city":"Suprstion", "type":"BC", "name":"BSO261"},
    {"city":"Suprstion", "type":"WtrTend", "name":"WT261"},
    {"city":"Suprstion", "type":"Brush", "name":"BR261"},
    {"city":"Suprstion", "type":"Rehab", "name":"RH261"},
    {"city":"Suprstion", "type":"Ambo", "name":"SWA261"},
    {"city":"Suprstion", "type":"Ambo", "name":"SWA262"},
    {"city":"Suprstion", "type":"Ambo", "name":"SWA265"},
    {"city":"Suprstion", "type":"AirVac", "name":"Native Air"},
    {"city":"Suprstion", "type":"AirVac", "name":"Life Net"},
    {"city":"Suprstion", "type":"AirVac", "name":"Ranger 41"},

    {"city":"Tempe", "type":"Engine", "name":"E271"},
    {"city":"Tempe", "type":"Engine", "name":"E272"},
    {"city":"Tempe", "type":"Engine", "name":"E273"},
    {"city":"Tempe", "type":"Engine", "name":"E274"},
    {"city":"Tempe", "type":"Engine", "name":"E275"},
    {"city":"Tempe", "type":"Engine", "name":"E276"},
    {"city":"Tempe", "type":"Engine", "name":"E277"},
    {"city":"Tempe", "type":"Engine", "name":"E278"},
    {"city":"Tempe", "type":"Ladder", "name":"L273"},
    {"city":"Tempe", "type":"Ladder", "name":"L276"},
    {"city":"Tempe", "type":"Ladder", "name":"Lt273"},
    {"city":"Tempe", "type":"Ladder", "name":"Lt276"},
    {"city":"Tempe", "type":"BC", "name":"BC271"},
    {"city":"Tempe", "type":"BC", "name":"BSO271"},
    {"city":"Tempe", "type":"SpecInc", "name":"SI272"},
    {"city":"Tempe", "type":"ScnSup", "name":"SS274"},
    {"city":"Tempe", "type":"SupVeh", "name":"SV276"},
    {"city":"Tempe", "type":"FireBt", "name":"FB271"},
    {"city":"Tempe", "type":"Squad", "name":"SQ271"},
    {"city":"Tempe", "type":"HazMat", "name":"HM272"},
    {"city":"Tempe", "type":"Medic", "name":"Med271"},
    {"city":"Tempe", "type":"Medic", "name":"Med272"},
    {"city":"Tempe", "type":"Medic", "name":"Med276"},
    {"city":"Tempe", "type":"AirVac", "name":"Native Air"},
    {"city":"Tempe", "type":"AirVac", "name":"Life Net"},
    {"city":"Tempe", "type":"AirVac", "name":"Ranger 41"}
]

