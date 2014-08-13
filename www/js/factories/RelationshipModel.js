angular.module('ontrack.factories').factory('RelationshipModel', function($http, BaseModel){

    function RelationshipModel(){
         _.extend(this, data);
        BaseModel.apply(this, arguments);
    }

    RelationshipModel.prototype = new BaseModel();

    RelationshipModel.prototype.$getRelationship = function(){
        // fetch some relationship.
        // maybe even the properties, too!
        return rel;
    };

    RelationshipModel.prototype.$updateRel = function(){
        
        // should probably at some point do some updating..
        return;
    };

    return RelationshipModel;
});
