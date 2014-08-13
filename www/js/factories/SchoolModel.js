angular.module('ontrack.factories').factory('SchoolModel', function(BaseModel){
    var name = 'School',
        apiUrl = '/school';

    function SchoolModel(){
        BaseModel.apply(this, arguments);
    }

    SchoolModel.prototype = new BaseModel();

    SchoolModel.prototype.$getName = function(){
        return name;
    };

    SchoolModel.prototype.$getApiUrl = function(){
        return apiUrl;
    };

    return SchoolModel;
});
