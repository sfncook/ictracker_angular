
angular.module('UserServices', ['ParseServices', 'DataServices'])

    .factory('CreateUser', [
        'ParseQuery', 'ConvertParseObject', 'Departments',
        function (ParseQuery, ConvertParseObject, Departments) {
        return function (username, password, email, department, roles) {
            var user = new Parse.User();
            user.set("username", username);
            user.set("password", password);
            user.set("email", email);
            for(var i=0; i<Departments.length; i++) {
                if(department.name==Departments[i].name) {
                    user.set("department", Departments[i]);
                    break;
                }
            }

            user.signUp(null, {
                success: function(user) {
                    console.log("Success!");
                    var roleACL = new Parse.ACL();
//                    for(var i=0; i<roles.length; i++) {
                        var role = new Parse.Role("asdf", roleACL);
                        role.getUsers().add(user);
                        role.save();
//                    }
                },
                error: function(user, error) {
                    // Show the error message somewhere and let the user try again.
                    console.log("Error: " + error.code + " " + error.message);
                }
            });
        }
    }])

;

