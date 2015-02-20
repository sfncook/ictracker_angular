
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.afterSave("Sector", function(request) {
    query = new Parse.Query("Incident");
    query.get(request.object.get("incident").id, {
        success: function(incident) {
            incident.increment("txid");
            incident.save();
        },
        error: function(error) {
            console.error("Got an error " + error.code + " : " + error.message);
        }
    });
});
