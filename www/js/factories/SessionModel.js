angular.module('ontrack.factories').factory('SessionModel', function(BaseModel){
    var name = 'Session',
        apiUrl = '/session';

    function SessionModel(){
        BaseModel.apply(this, arguments);
    }

    SessionModel.prototype = new BaseModel();

    SessionModel.prototype.$getName = function(){
        return name;
    };

    SessionModel.prototype.$getApiUrl = function(){
        return apiUrl;
    };

    return SessionModel;
});
