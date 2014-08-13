angular.module('ontrack.factories').factory('GradedEventModel', function(BaseModel){
    var name = 'GradedEvent',
        apiUrl = '/gradedevent';

    function GradedEventModel(data){
        _.extend(this, data);
        BaseModel.apply(this, arguments);
    }

    GradedEventModel.prototype = new BaseModel();

    GradedEventModel.prototype.$getName = function(){
        return name;
    };

    GradedEventModel.prototype.$getApiUrl = function(){
        return apiUrl;
    };

    GradedEventModel.prototype.$changeGradedEventGrade = function(accountId){
        var self = this,
            configObj = {withCredentials: true};

        $http.put(serverApiUrl + '/account/' + accountId + '/rel/IS_FOR/' + self.id, this, configObj)
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


    return GradedEventModel;
});
