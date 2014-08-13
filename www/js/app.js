'use strict';

// angular.module is a global place for creating, registering and retrieving Angular modules
// the 2nd parameter is an array of 'requires'
angular.module('ontrack', ['ionic', 'ontrack.controllers', 'ontrack.directives', 'ontrack.factories', 'ontrack.filters', 'ontrack.services', 'angularMoment', 'ui.calendar', 'ngCookies', 'ngMd5'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  $stateProvider

    .state('welcome1', {
      url: "/welcome1",
      templateUrl: "templates/welcome1.html",
      controller: 'WelcomeCtrl'
    })

    .state('welcome2', {
      url: "/welcome2",
      templateUrl: "templates/welcome2.html",
      controller: 'OnboardCtrl'
    })

    .state('welcome3', {
      url: "/welcome3",
      templateUrl: "templates/welcome3.html",
      controller: 'OnboardCtrl'
    })

    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: 'LoginCtrl'
    })

    .state('logout', {
        url: "/logout",
        templateUrl: "templates/logout.html",
        controller: 'LogoutCtrl'
    })

    .state('onboard', {
      url: "/onboard",
      templateUrl: "templates/onboard.html",
      controller: 'OnboardCtrl'
    })

    .state('onboard.step1', {
      url: '/onboard1',
      templateUrl: 'templates/onboard-step1.html'
    })
     .state('onboard.step2', {
      url: '/onboard2',
      templateUrl: 'templates/onboard-step2.html'
    })
    .state('onboard.step3', {
      url: '/onboard3',
      templateUrl: 'templates/onboard-step3.html'
    })
    .state('onboard.step4', {
      url: '/onboard4',
      templateUrl: 'templates/onboard-step4.html'
    })
	
    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/onboard.html',
          controller: 'OnboardCtrl'
        }
      }
    })
     
    .state('tab.calendar', {
      url: '/calendar',
      views: {
        'tab-calendar': {
          templateUrl: 'templates/tab-calendar.html',
          controller: 'CalendarCtrl'
        }
      }
    })
   
    .state('tab.contactus', {
      url: '/contactus',
      views: {
        'tab-contactus': {
          templateUrl: 'templates/tab-contactus.html',
          controller: 'ContactUsCtrl'
        }
      }
    })

    .state('tab.courses', {
      url: '/courses',
      views: {
        'tab-courses': {
          templateUrl: 'templates/tab-courses.html',
          controller: 'CoursesCtrl'
        }
      }
    })

    .state('tab.course-detail', {
      url: '/course/:courseId',
      views: {
        'tab-courses': {
          templateUrl: 'templates/course-detail.html',
          controller: 'CourseDetailCtrl'
        }
      }
    })

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('tab.friends', {
      url: '/friends',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })

    .state('tab.friend-detail', {
      url: '/friend/:friendId',
      views: {
        'tab-friends': {
          templateUrl: 'templates/friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome1');
//  $locationProvider.html5Mode(true);

});

angular.module('ontrack.factories', ['ontrack.services']);
