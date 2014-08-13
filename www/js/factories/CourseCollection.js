angular.module('ontrack.factories').factory('CourseCollection', function($http, BaseCollection, CourseModel, serverApiUrl){
    var name = "Course",
        apiUrl = '/course';

    function CourseCollection(){
        BaseCollection.apply(this, arguments);
    }

    CourseCollection.prototype = new BaseCollection();

    CourseCollection.prototype.$model = CourseModel;

    CourseCollection.prototype.$getName = function(){
        return name;
    };

    CourseCollection.prototype.$getApiUrl = function(){
        return apiUrl;
    };

    CourseCollection.prototype.$getListBySchool = function(schoolId){
        return this.$fetchRelatedNodes('school', schoolId, 'OFFERED_AT', 'in');
    };

    return CourseCollection;
});
