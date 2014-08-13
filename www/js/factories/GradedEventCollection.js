angular.module('ontrack.factories').factory('GradedEventCollection', function(BaseCollection, GradedEventModel){
    var name = "GradedEvent",
        apiUrl = '/gradedevent';

    function GradedEventCollection(){
        BaseCollection.apply(this, arguments);
    }

    GradedEventCollection.prototype = new BaseCollection();

    GradedEventCollection.prototype.$model = GradedEventModel;

    GradedEventCollection.prototype.$getName = function(){
        return name;
    };

    GradedEventCollection.prototype.$getApiUrl = function(){
        return apiUrl;
    };


    return GradedEventCollection;
});
