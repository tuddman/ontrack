angular.module('ontrack.factories').factory('SchoolCollection', function(BaseCollection){
    var name = "School",
        apiUrl = '/school';

    function SchoolCollection(){
        BaseCollection.apply(this, arguments);
    }

    SchoolCollection.prototype = new BaseCollection();

    SchoolCollection.prototype.$getName = function(){
        return name;
    };

    SchoolCollection.prototype.$getApiUrl = function(){
        return apiUrl;
    };

    return SchoolCollection;
});
