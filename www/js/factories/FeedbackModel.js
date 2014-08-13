angular.module('ontrack.factories').factory('FeedbackModel', function(BaseModel){
    var name = 'Feedback',
        apiUrl = '/feedback';

    function FeedbackModel(){
        BaseModel.apply(this, arguments);
    }

    FeedbackModel.prototype = new BaseModel();

    FeedbackModel.prototype.$getName = function(){
        return name;
    };

    FeedbackModel.prototype.$getApiUrl = function(){
        return apiUrl;
    };

    return FeedbackModel;
});
