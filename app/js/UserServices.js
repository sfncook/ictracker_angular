'use strict';

angular.module('UserServices', ['DataServices', 'DepartmentServices', 'AdapterServices'])

    .factory('IsLoggedIn', function (AdapterStore) {
        return function () {
            return AdapterStore.isLoggedIn();
        }
    })

    .factory('LoadCurrentUser', ['ConvertParseObject', 'DataStore', function (ConvertParseObject, DataStore) {
        return function () {

            DataStore.currentUser = Parse.User.current();
            ConvertParseObject(DataStore.currentUser, USER_DEF);

            var queryUser = new Parse.Query(Parse.Object.extend('User'));
            queryUser.equalTo("objectId", DataStore.currentUser.id);
            return queryUser.first({
                success: function(currentUser_) {
                    ConvertParseObject(currentUser_, USER_DEF);
                    DataStore.currentUser = currentUser_;
                },
                error: function(error) {
                    console.log('Failed queryUser, with error code: ' + error.message);
                }
            });
        }
    }])

    .factory('AllUsers', function() {
        return new Array();
    })

    .factory('LoadAllUsers', ['ConvertParseObject', 'AllUsers', function (ConvertParseObject, AllUsers) {
        return function () {
            var queryUser = new Parse.Query(Parse.Object.extend('User'));
            return queryUser.find({
                success: function(allUsers) {
                    AllUsers.removeAll();
                    for(var i=0; i<allUsers.length; i++) {
                        var user = allUsers[i];
                        ConvertParseObject(user, USER_DEF);
                        if(user.department){
                            user.department.name_long = user.department.get('name_long');
                        }
                        AllUsers.push(user);
                    }
                },
                error: function(error) {
                    console.log('Failed LoadAllUsers, with error code: ' + error.message);
                }
            });
        }
    }])

    .factory('UserLogin', [function () {
        return function (username, password, callback_success, callback_error) {
            return Parse.User.logIn(username, password, {
                success: function(user) {
                    console.log("Login success! user:");
                    console.log(user);
                    if (callback_success) {
                        callback_success(user);
                    }
                },
                error: function(user, error) {
                    console.log("Login error:");
                    console.log(error.message);
                    if (callback_error) {
                        callback_error(error);
                    }
                }
            });
        }
    }])

    .factory('UserLogout', ['ResetSavedDepartment', function (ResetSavedDepartment) {
        return function () {
            console.log("UserLogout");
            ResetSavedDepartment();
            return Parse.User.logOut();
        }
    }])

    .factory('CreateUser', ['InitDefaultDatabase', 'InitDbForDepartment', function (InitDefaultDatabase, InitDbForDepartment) {
        return function (username, password, name, email, department_obj, callback_success, callback_error) {

            InitDefaultDatabase();
            var user = new Parse.User();
            user.set("username", username);
            user.set("password", password);
            user.set("name", name);
            user.set("email", email);
            user.set("department", department_obj);

            user.signUp(null, {
                success: function(new_user){
                    InitDbForDepartment(department_obj.id).then(function(){
                        var user = new Parse.User();
                        user.set("username", username);
                        user.set("password", password);
                        user.set("name", name);
                        user.set("email", email);
                        user.set("department", department_obj);

                        user.signUp(null, {
                            success: function(new_user){
                                if (callback_success) {
                                    callback_success(new_user);
                                }
                            },
                            error: function(user, error) {
                                console.log("CreateUser error:");
                                console.log(error.message);
                                if (callback_error) {
                                    callback_error(error);
                                }
                            }
                        });

                        if (callback_success) {
                            callback_success(user);
                        }
                    });
                },
                error: function(user, error) {
                    console.log("CreateUser error:");
                    console.log(error.message);
                    if (callback_error) {
                        callback_error(error);
                    }
                }
            });
        }
    }])

    .factory('AddUserToRole', [function () {
        return function (username, rolename) {
            var query = new Parse.Query(Parse.Role);
            query.equalTo("name", rolename);
            return query.first({
                success: function(role) {
                    console.log("successfully found "+rolename+" role");
                    console.log(role);
                    var queryU = new Parse.Query(Parse.User);
                    queryU.equalTo("username", username);
                    queryU.first({
                        success: function(userToAddToRole) {
                            console.log("userToAddToRole:");
                            console.log(userToAddToRole);
                            role.getUsers().add(userToAddToRole);
                            role.save();
                        }
                    });
                },
                error: function(error) {
                    console.log('Error: ');
                    console.log(error.message);
                }
            });
        }
    }])

    .factory('AddStrongRoleToWeakRole', [function () {
        return function (strongrolename, weakrolename) {
            var query_weak = new Parse.Query(Parse.Role);
            query_weak.equalTo("name", weakrolename);
            return query_weak.first({
                success: function(weak_role) {
                    console.log("successfully found weakrolename "+weakrolename+" role");
                    console.log(weak_role);
                    var query_strong = new Parse.Query(Parse.Role);
                    query_strong.equalTo("name", strongrolename);
                    query_strong.first({
                        success: function(strong_role) {
                            console.log("successfully found strongrolename "+strongrolename+" role");
                            console.log(strong_role);
                            weak_role.getRoles().add(strong_role);
                            weak_role.save();
                        },
                        error: function(error) {
                            console.log('Error: ');
                            console.log(error.message);
                        }
                    });
                },
                error: function(error) {
                    console.log('Error: ');
                    console.log(error.message);
                }
            });
        }
    }])

;

