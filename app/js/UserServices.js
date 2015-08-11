'use strict';

angular.module('UserServices', ['DataServices'])

    .factory('IsLoggedIn', [function () {
        return function () {
            return Parse.User.current();
        }
    }])

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

    .factory('UserLogout', [function () {
        return function () {
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

;

