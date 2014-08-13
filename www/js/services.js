'use strict';

angular.module('ontrack.services', ['ontrack.factories'])


.factory('Friends', function() {

  // Some fake friends to get you started. 
  var friends = [
    { id: 0, name: 'John in English 101' },
    { id: 1, name: 'Joe in History 102' },
    { id: 2, name: 'Joan in Physics 103' },
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})

.service('LocalStorageService', function(){
    this.get =
        function(key){
            return JSON.parse(localStorage.getItem(key));
        };

    this.set =
        function(key, value){
            try{
                localStorage.setItem(key, JSON.stringify(value));
            }catch(ex){
                console.log("Cache limit exceeded!");
            }
        };

    this.remove =
        function(key){
            return localStorage.removeItem(key);
        };

    this.clear =
        function(){
            localStorage.clear();
        };
})

.factory('PushProcessingService', function(BenefitsService) {
        function onDeviceReady() {
            console.info('NOTIFY  Device is ready.  Registering with GCM server');
            //register with google GCM server
            var pushNotification = window.plugins.pushNotification;
            pushNotification.register(gcmSuccessHandler, gcmErrorHandler, {"senderID" : gcmAppID, "ecb" : "onNotificationGCM" });
        }
        function gcmSuccessHandler(result) {
            console.info('NOTIFY  pushNotification.register succeeded.  Result = '+result)
        }
        function gcmErrorHandler(error) {
            console.error('NOTIFY  '+error);
        }
        return {
            initialize : function () {
                console.info('NOTIFY  initializing');
                document.addEventListener('deviceready', onDeviceReady, false);
            },
            registerID : function (id) {
                //Insert code here to store the user's ID on your notification server. 
                //You'll probably have a web service (wrapped in an Angular service of course) set up for this.  
                //For example:
                MyService.registerNotificationID(id).then(function(response){
                    if (response.data.Result) {
                        console.info('NOTIFY  Registration succeeded');
                    } else {
                        console.error('NOTIFY  Registration failed');
                    }
                });
            }, 
            //unregister can be called from a settings area.
            unregister : function () {
                console.info('unregister')
                var push = window.plugins.pushNotification;
                if (push) {
                    push.unregister(function () {
                        console.info('unregister success')
                    });
                }
            }
        }
})
 

.service('SessionService', (function(){
    function SessionService($http, SessionModel, AccountModel, LocalStorageService, serverApiUrl, md5){
        var self = this,
            sessionModel = new SessionModel(),
            accountModel = new AccountModel();

        this.$login = function(data){
            data.password = md5.createHash(data.password);
            _.extend(sessionModel, data);
            sessionModel.once('api:successfulCreation', function(){
                _.extend(accountModel, this);       // our backend returns account data back /session POST
                accountModel.$saveLocal();
                this.$$isNew = true; // hack for SessionService
                self.emit('login', accountModel);
            });
            sessionModel.once('api:unsuccessfulCreation', function(){
                self.emit('failedLogin');
            });
            sessionModel.$save();
        };

        this.$logout = function(){
            $http.delete(serverApiUrl + sessionModel.$getApiUrl(), {withCredentials: true})
                .success(function(data){
                    LocalStorageService.remove(accountModel.$getSpecialLocalStorageKey());
                    self.emit('logout');
                })
                .error(function(){
                    self.emit('failedLogout');
                });
        };

        this.$getAccountInLocalStorage = function(){
            return LocalStorageService.get(accountModel.$getSpecialLocalStorageKey());
        }
    }

    SessionService.prototype = new EventEmitter2();

    return SessionService;
})());

 
// ALL GCM notifications come through here. 
function onNotificationGCM(e) {
    console.log('EVENT -> RECEIVED:' + e.event + '');
    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                console.log('REGISTERED with GCM Server ->  REGID:' + e.regid + "");
 
                //call back to web service in Angular.  
                //This works for me because in my code I have a factory called
                //      PushProcessingService with method registerID
                var elem = angular.element(document.querySelector('[ng-app]'));
                var injector = elem.injector();
                var myService = injector.get('PushProcessingService');
                myService.registerID(e.regid);
            }
            break;
 
        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground)
            {
                //we're using the app when a message is received.
                console.log('--INLINE NOTIFICATION--' + '');
 
                // if the notification contains a soundname, play it.
                //var my_media = new Media(&quot;/android_asset/www/&quot;+e.soundname);
                //my_media.play();
                alert(e.payload.message);
            }
            else
            {   
                // otherwise we were launched because the user touched a notification in the notification tray.
                if (e.coldstart)
                    console.log('--COLDSTART NOTIFICATION--' + '');
                else
                    console.log('--BACKGROUND NOTIFICATION--' + '');
 
                // direct user here:
                window.location = "#/tab/featured";
            }
 
            console.log('MESSAGE -> MSG: ' + e.payload.message + '');
            console.log('MESSAGE: '+ JSON.stringify(e.payload));
            break;
 
        case 'error':
            console.log('ERROR -> MSG:' + e.msg + '');
            break;
 
        default:
            console.log('EVENT -> Unknown, an event was received and we do not know what it is');
            break;
    }
}

