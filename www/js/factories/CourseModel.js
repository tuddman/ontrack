angular.module('ontrack.factories').factory('CourseModel', function($http, BaseModel, serverApiUrl){
    var name = 'Course',
        apiUrl = '/course';

    function CourseModel(data){
        _.extend(this, data);
        BaseModel.apply(this, arguments);
    }

    CourseModel.prototype = new BaseModel();

    CourseModel.prototype.$getName = function(){
        return name;
    };

    CourseModel.prototype.$getApiUrl = function(){
        return apiUrl;
    };

    // this should really be on a new object's prototype, and be named updateRel()
    // the new object should be a relationship model, which is used to extend the base model and
    // and construct the course model
    // for now we are going to leave this while we learn more and tinker
    CourseModel.prototype.$changeGrade = function(accountId){
        var self = this,
            configObj = {withCredentials: true};

        $http.put(serverApiUrl + '/account/' + accountId + '/rel/ENROLLED_IN/' + self.id, this, configObj)
            .success(function(data){
                _.extend(self, data);
                self.$$isNew = false;

                self.emit('api:successfulUpdate');
            })
            .error(function(){
                self.emit('api:unsuccessfulUpdate');
            });

        return this;
    };

    return CourseModel;
});
