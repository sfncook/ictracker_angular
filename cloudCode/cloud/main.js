
Parse.Cloud.afterSave("Incident", function(request) {
    incident.increment("txid");
    incident.save();
});

Parse.Cloud.afterSave("Mayday", function(request) {
    query = new Parse.Query("Incident");
    query.get(request.object.get("incident").id, {
        success: function(incident) {
            incident.increment("txid");
            incident.save();
        },
        error: function(error) {
            console.error("Got an error saving Incident " + error.code + " : " + error.message);
        }
    });
});

Parse.Cloud.afterSave("Sector", function(request) {
    query = new Parse.Query("Incident");
    query.get(request.object.get("incident").id, {
        success: function(incident) {
            incident.increment("txid");
            incident.save();
        },
        error: function(error) {
            console.error("Got an error saving Sector " + error.code + " : " + error.message);
        }
    });
});

Parse.Cloud.afterSave("Unit", function(request) {
    query = new Parse.Query("Sector");
    query.get(request.object.get("sector").id, {
        success: function(sector) {
            queryInc = new Parse.Query("Incident");
            queryInc.get(sector.object.get("incident").id, {
                success: function(incident) {
                    incident.increment("txid");
                    incident.save();
                },
                error: function(error) {
                    console.error("Got an error saving Unit (save Incident) " + error.code + " : " + error.message);
                }
            });
        },
        error: function(error) {
            console.error("Got an error saving Unit (find Sector)" + error.code + " : " + error.message);
        }
    });
});

Parse.Cloud.define("setUserRole", function(request, response) {
    console.log("request");
    console.log(request);

    if (!request.user) {
        response.error("Must be signed in to call this Cloud Function.")
        return;
    } else {
        console.log("request.user");
        console.log(request.user);
    }

    var query = new Parse.Query(Parse.User);
    query.get(request.params.userId, {
        success: function(userObj) {
            console.log("userObj");
            console.log(userObj);

            Parse.Cloud.useMasterKey();
            var roleACL = new Parse.ACL();
            var role = new Parse.Role("admin", roleACL);
            role.getUsers().add(userObj);
            role.save(null, {
                success: function(response) {
                    console.log("Success saving role");
                    response.success("Success.");
                },
                error: function(error) {
                    console.error("Error saving role: " + error.code + " : " + error.message);
                    response.error("Error.");
                }
            });
        },
        error: function(error) {
            console.error("Error: " + error.code + " : " + error.message);
            response.error("Error.");
        }
    });

    query.first({
        success: function(userObj) {
            console.log("userObj");
            console.log(userObj);
        },
        error: function(error) {
            console.error("Error: " + error.code + " : " + error.message);
        }
    });

});

function getSectorsForIncident(sectors, sectorIndex) {
    //console.log(JSON.stringify(sectors[sectorIndex]));
    if(sectorIndex>=sectors.length) {
        return sectors;
    }

    var sector = sectors[sectorIndex];
    var Unit = Parse.Object.extend("Unit");
    var query_unit = new Parse.Query(Unit);
    query_unit.equalTo("sector", sector.objectId);
    query_unit.find({
        success: function(sectors) {
            //sectors_updated = getSectorsForIncident(sectors, 0);
            //incident["sectors"]=sectors_updated;
            //incident_json_str = JSON.stringify(incident);
            //console.log(incident_json_str);
            //response.success(incident_json_str);
            //response.success(sectors.length);
            var incident_data = {};
            incident_data['incident'] = incident;
            incident_data['sectors'] = sectors;
            response.success(JSON.stringify(incident_data));
        },
        error: function(error) {
            console.error("Sectors lookup failed for incidentObjectId:"+request.params.incidentObjectId+" Error:" + error.code + " : " + error.message);
        }
    });
}

/*
 * This function is currently not used for anything other than just experimenting
 * with CloudCode to see if we can use it for complex object composition on server
 * side.
 */
Parse.Cloud.define("incidentDataAll", function(request, response) {
    var query_inc = new Parse.Query("Incident");
    query_inc.get(request.params.incidentObjectId, {
        success: function(incident) {

            var Sector = Parse.Object.extend("Sector");
            var query_sector = new Parse.Query(Sector);
            query_sector.equalTo("incident", incident.objectId);
            query_sector.find({
                success: function(sectors) {
                    //sectors_updated = getSectorsForIncident(sectors, 0);
                    //incident["sectors"]=sectors_updated;
                    //incident_json_str = JSON.stringify(incident);
                    //console.log(incident_json_str);
                    //response.success(incident_json_str);
                    //response.success(sectors.length);
                    var incident_data = {};
                    incident_data['incident'] = incident;
                    incident_data['sectors'] = sectors;
                    response.success(JSON.stringify(incident_data));
                },
                error: function(error) {
                    console.error("Sectors lookup failed for incidentObjectId:"+request.params.incidentObjectId+" Error:" + error.code + " : " + error.message);
                }
            });
        },
        error: function(error) {
            console.error("Incident lookup failed for incidentObjectId:"+request.params.incidentObjectId+" Error:" + error.code + " : " + error.message);
        }
    });
});
