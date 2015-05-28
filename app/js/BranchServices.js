
angular.module('BranchServices', ['ParseServices', 'DataServices'])

    .factory('CreateBranch', ['DefaultErrorLogger', function (DefaultErrorLogger) {
        return function (user, inc_type) {
            console.log("CreateBranch user:"+user.name+" inc_type:"+inc_type.nameLong);
        }
    }])

;

