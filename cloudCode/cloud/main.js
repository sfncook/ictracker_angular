
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
