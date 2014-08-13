angular.module('ontrack.factories').factory('BaseModel', function($http, LocalStorageService, serverApiUrl){

    function BaseModel(){
        this.$$isNew = true; // could this be moved to private?
    }

    // optionally declare private functions here

    BaseModel.prototype = new EventEmitter2({maxListeners:20});

    BaseModel.prototype.$save = function(updateLocalStorage, cb){
        var self = this;

        if(_.isFunction(updateLocalStorage)){
            cb = updateLocalStorage;
        }

        if(this.$$isNew){
            $http.post(serverApiUrl + this.$getApiUrl(), this, {withCredentials: true})
                .success(function(data){

                    _.extend(self, data);
                    self.$$isNew = false;

                    self.emit('api:successfulCreation');

                    if(updateLocalStorage){
                        self.$saveLocal();
                    }

                    cb && cb();

                })
                .error(function(){
                    self.emit('api:unsuccessfulCreation');
                    cb && cb.call(this, arguments);
                });

            return this;

        }

        $http.put(serverApiUrl + this.$getApiUrl(), this, {withCredentials: true})
            .success(function(data){

                _.extend(self, data);
                self.emit('api:successfulUpdate');

                if(updateLocalStorage){
                    self.$saveLocal();
                }
            })
            .error(function(){
                self.emit('api:unsuccessfulUpdate');
            });

        return this;

    };

    BaseModel.prototype.$fetch = function(id){
        var self = this;

        id = id || this.id;

        if(id === undefined){
            throw Error('$fetch() aborted, id not available');
        }

        this.$$isNew = false;

        $http.get(serverApiUrl + this.$getApiUrl() + '/' + id, {withCredentials: true})
            .success(function(data){
                _.extend(self, data);
                self.emit('api:successfulGet');
            })
            .error(function(){
                self.emit('api:unsuccessfulGet');
            });

        return this;
    };

    BaseModel.prototype.$destroy = function(){
        var self = this;

        if(this.$$isNew){
            this.emit('self:destroy');
            return this;
        }

        $http.delete(url + this.$getApiUrl() + '/' + this.id, {withCredentials: true})
            .success(function(data){
                self.emit('api:successfulDestruction');
            })
            .error(function(){
                self.emit('api:unsuccessfulDestruction');
            });

        return this;
    };

    BaseModel.prototype.$saveLocal = function(){
        var localStorageKey = this.$getSpecialLocalStorageKey?
                              this.$getSpecialLocalStorageKey() : this.$getName() + '-' + this.id;
        if(this.$$isNew){
            throw Error('cannot call $saveLocal on a new model');
        }
        LocalStorageService.set(localStorageKey, omit(this));
        this.emit('localStore:successfulSave');

        return this;
    };

    BaseModel.prototype.$load = function(id){
        var localStorageKey = this.$getSpecialLocalStorageKey && this.$getSpecialLocalStorageKey(),
            localStorageValue;

        if(!localStorageKey && !id){
            throw Error('missing parameter: id');
        }

        if(!localStorageKey) {
            localStorageKey = this.$getName() + '-' + this.id;
        }

        localStorageValue = LocalStorageService.get(localStorageKey);

        if(localStorageValue === undefined){
            this.emit('localStore:unsuccessfulLoad');
            throw Error('failed to $load key ' + localStorageKey + ' from Local Storage');
        }

        _.extend(this, localStorageValue);

        this.$$isNew = false; // really? what if we want to LS something that $$isNew

        this.emit('localStore:successfulLoad');

        return this;
    };

    BaseModel.prototype.$complexSet = function(property, dataObj){
        // should check here that property or dataObj don't have properties that start with $
        // unless we want to allow this :)
        if(!dataObj) {
            _.extend(this, property);
        }else{
            this[property] = dataObj;
        }
        return this;
    };

    BaseModel.prototype.$graphFetchRelated = function(nodeId, relType){
        var self = this,
            configObj = {withCredentials: false};

        $http.get(serverApiUrl + this.$getApiUrl() + '/' + nodeId + '/rel/' + relType + '/all/nodes', configObj)
            .success(function(items){
                if(self.$isEmpty()) {
                    _.each(items, function(item){
                        self.push(item);
                    });

                }else{
                    console.error('$fetch can only fill empty model, sorry!');
                }

                self.emit('api:successfulGet');
            })
            .error(function(){
                self.emit('api:unsuccessfulGet');
            });

        return this;

    };

    BaseModel.prototype.$fetchRelationship = function(model, fromId, relationshipType, direction, cb){
        var self = this,
            configObj = {params: {}, withCredentials: true};

        direction = (typeof direction == 'string') && direction || 'all';

        if(_.isFunction(direction)){
            cb = direction;
        }

        $http.get(serverApiUrl + '/' + model + '/' + fromId + '/rel/' + relationshipType + '/' + direction, configObj)
            .success(function(data){
                _.extend(self, data);
                self.emit('api:successfulGet');
                cb && cb();
            })
            .error(function(){
                self.emit('api:unsuccessfulGet');
                cb && cb.call(this, arguments);
            });

        return this;
    };

    BaseModel.prototype.$createRelationship = function(from, type, to, properties, cb){
        var self = this;

        $http.post(serverApiUrl + this.$getApiUrl() + '/' + from + '/rel/' + type + '/' + to, properties, {withCredentials: true})
            .success(function(data){
                //self.emit('api:successfulCreation');
                _.isFunction(cb) && cb();
            })
            .error(function(){
                //self.emit('api:unsuccessfulCreation');
                _.isFunction(cb) && cb.call(this, arguments);
            });

        return this;
    };

    function omit(obj){
        var returnObj = {};
        for(var i in obj){
            if(!obj.hasOwnProperty(i)){ continue; }
            if(i.indexOf('$') === 0){
                continue;
            }
            returnObj[i] = obj[i];
        }
        return returnObj;
    };

    return BaseModel;
});
