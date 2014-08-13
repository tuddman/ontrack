angular.module('ontrack.factories').factory('BaseCollection', function($http, serverApiUrl){

    function BaseCollection(){

    }

    // optionally declare private functions here

    BaseCollection.prototype =
        (function(){
            var F = function(){};
            F.prototype = Array.prototype;
            _.extend(F.prototype, new EventEmitter2()); // we'll want to check that this is safe
            return new F();
        })();

    BaseCollection.prototype.push = function(model){
        // trigger events here if we want
        [].push.call(this, model);
    };

    BaseCollection.prototype.$fetch = function(queryObj){
        var self = this,
            configObj = {params: {}, withCredentials: true};

        _.extend(configObj.params, queryObj || {});

        $http.get(serverApiUrl + this.$getApiUrl(), configObj)
            .success(function(items){
                if(self.$isEmpty()) {
                    _.each(items, function(item){
                        self.push(item);
                    });

                }else{
                    console.error('$fetch can only fill empty collection, sorry!');
                }

                self.emit('api:successfulGet');
            })
            .error(function(){
                self.emit('api:unsuccessfulGet');
            });

        return this;
    };

    BaseCollection.prototype.$fetchRelatedNodes = function(model, fromId, relationshipType, direction, cb){
        var self = this,
            configObj = {params: {}, withCredentials: true};

        direction = (typeof direction == 'string') && direction || 'all';

        if(_.isFunction(direction)){
            cb = direction;
        }

        $http.get(serverApiUrl + '/' + model + '/' + fromId + '/rel/' + relationshipType + '/' + direction + '/nodes', configObj)
            .success(function(items){
                if(self.$isEmpty()) {
                    _.each(items, function(item){
                        if(self.$model){
                            self.push(new self.$model(item));
                        }else{
                            self.push(item);
                        }
                    });

                }else{
                    console.error('$fetchRelatedNodes  can only fill empty collection, sorry!');
                }

                self.emit('api:successfulGet');
                cb && cb();
            })
            .error(function(){
                self.emit('api:unsuccessfulGet');
                cb && cb.call(this, arguments);
            });

        return this;
    };

    BaseCollection.prototype.$fetchRelationships = function(model, fromId, relationshipType, direction, cb){
        var self = this,
            configObj = {params: {}, withCredentials: true};

        direction = (typeof direction == 'string') && direction || 'all';

        if(_.isFunction(direction)){
            cb = direction;
        }

        $http.get(serverApiUrl + '/' + model + '/' + fromId + '/rel/' + relationshipType + '/' + direction + '/nodes', configObj)
            .success(function(items){
                self = _.map(self, function(item){
                    var relationship = _.find(items, function(i){ return i.end == item.id });
                    if(relationship){
                        _.extend(item, relationship);
                    }
                    return item;
                })
                _.isFunction(cb) && cb();
            })
            .error(function(){
                _.isFunction(cb) && cb.call(this, arguments);
            });

        return this;
    };

    BaseCollection.prototype.$isEmpty = function(){
        return !this.length;
    };

    return BaseCollection;
});
