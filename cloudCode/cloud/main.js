
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

