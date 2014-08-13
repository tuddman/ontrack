'use strict';

angular.module('ontrack.controllers', [])

.controller('AccountCtrl', function($scope){})

.controller('CalendarCtrl', function($scope){
	    /* config object */
	    $scope.uiConfig = {
              calendar:{
                height: 450,
	        editable: true,
	        header:{
	         left: 'month basicWeek basicDay agendaWeek agendaDay',
	         center: 'title',
	         right: 'today prev,next'
	        },
	        dayClick: $scope.alertEventOnClick,
	        eventDrop: $scope.alertOnDrop,
	        eventResize: $scope.alertOnResize
	      }
       };
})

.controller('ContactUsCtrl', function($scope, $window, FeedbackModel){
    var feedbackModel = new FeedbackModel();

    $scope.formData = {};
    $scope.uiFeedback = false;

    $scope.sendMail = function(){
        var link = "mailto:ontrackfeedback@gmail.com"
               //  + "?cc=myCCaddress@example.com"
               //  + "&subject=" + escape("Ontrack Feedback")
               //  + "&body=" + escape(document.getElementById('myText').value);
        $window.location.href = link;
    };

    $scope.sendFeedback = function(){
        feedbackModel.message = $scope.formData.message;
        feedbackModel.$save(function(err){
            feedbackModel = new FeedbackModel();
            $scope.uiFeedback = true;
            if(err){
                $scope.feedbackResponse = 'Error sending feedback';
                return;
            }
            $scope.feedbackResponse = 'Thank you for your feedback';
            $scope.formData.message = '';
        });
    };

})

.controller('CoursesCtrl', function($scope, $location, AccountModel, CourseCollection){
    $scope.accountModel = (new AccountModel()).$load();

    $scope.accountModel.courses = new CourseCollection();

    $scope.accountModel.courses.on('api:successfulGet', function(){
       var asdf = 1;
    });
    
    $scope.accountModel.courses.$fetchRelatedNodes('account', $scope.accountModel.id, 'ENROLLED_IN');

    $scope.showCoursesForm = true;

    $scope.changeGrade = function(course) {
        var grades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
        grades.reverse();

        if(!course.grade){
            course.grade = 'F';
        }else{
            var gradeIndex = grades.indexOf(course.grade);
            course.grade = (gradeIndex === grades.length - 1) ? 'F' : grades[gradeIndex + 1];
        }

        course.$changeGrade($scope.accountModel.id);
    };

})

.controller('CourseDetailCtrl', function($scope, $location, AccountModel, CourseModel, GradedEventCollection) {
    var courseId = _.last($location.url().split('/')),
        unsortedGradedEvents;

    $scope.accountModel = new AccountModel();

    $scope.accountModel.$load();

    $scope.course = (new CourseModel()).$fetch(courseId);

    $scope.course.relationship = (new CourseModel()).$fetchRelationship('account', courseId, 'ENROLLED_IN');

    // had to go with this approach for now because we couldn't get orderBy working in angular template
    unsortedGradedEvents = (new GradedEventCollection()).$fetchRelatedNodes('course', courseId, 'IS_FOR', 'all', function(){
        unsortedGradedEvents.sort(function(a, b){
            return a.dueDate - b.dueDate;
        });
        $scope.gradedevents = unsortedGradedEvents;
        $scope.gradedevents.$fetchRelationships('account', $scope.accountModel.id, 'HAS_GRADE', 'all', function(err){
            console.log($scope.gradedevents)
        });
    });


})

.controller('DashCtrl', function($scope){})

.controller('FriendsCtrl', function($scope, Friends){
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('GradeEntryCtrl', function($scope, $ionicModal, AccountModel) {
    var relProperties = {};
    $scope.errMessage = '';
    $scope.hideEnterGradePercentage = true;

    $scope.accountModel = (new AccountModel()).$load();

    $scope.grade = {};

    $scope.toggleGradeEntry = function(type) {
        $scope.errMessage = '';
        switch(type){
            case 'grade':
                $scope.hideEnterGradePercentage = true;
                $scope.hideEnterGradeLetterGrade = false;
                break;
            case 'percent':
                $scope.hideEnterGradeLetterGrade = true;
                $scope.hideEnterGradePercentage = false;
                break;
            default:
                throw 'Invalid type: ' + type;
        }

    };



    $ionicModal.fromTemplateUrl('enterGrade-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function(gradedevent) {
        $scope.gradedevent = gradedevent;
        $scope.modal.show();
   
 
    $scope.changeGradedEventGrade = function(gradedevent) {
        var grades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
        grades.reverse();

        if(!gradedevent.grade){
            $scope.gradedevent.grade = 'F';
        }else{
            var gradeIndex = grades.indexOf(gradedevent.grade);
            $scope.gradedevent.grade = (gradeIndex === grades.length - 1) ? 'F' : grades[gradeIndex + 1];
        }
    };

   
    
    
    
    };
    $scope.submitGrade = function() {
        if($scope.hideEnterGradePercentage){
            // no validation needed right now
            _.extend(relProperties, {
                type: 'letter',
                letterGrade: $scope.gradedevent.grade
            });
        }else{
            if(_.isUndefined($scope.grade.ptsAttained) || _.isUndefined($scope.grade.ptsTotal)){
                // show error
                $scope.errMessage = 'Invalid entry';
                return;
            }
            if($scope.grade.ptsAttained > $scope.grade.ptsTotal){
                // show error pts attained cannot be greater than pts total (for now, we know some sissy schools
                // allow grades to be great than 100%)
                $scope.errMessage = '100% is the max, sorry!';
                return;
            }
            _.extend(relProperties, {
                type:'points',
                attained: $scope.grade.ptsAttained,
                total: $scope.grade.ptsTotal
            });
        }


        $scope.accountModel.$createRelationship($scope.accountModel.id, 'HAS_GRADE', $scope.gradedevent.id,
            relProperties,
            function(err){
                if(err){
                    $scope.errMessage = 'Server error: failure to save your grade';
                    return;
                }
                $scope.closeModal();
            }
        );

    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });


})


.controller('LoginCtrl', function($scope, $location, SessionService){

    SessionService.on('login', function(){
        $location.path('/tab/courses');
    });

    SessionService.on('failedLogin', function(){
        $scope.error = true;
    });

    $scope.$login = function(){
        if(!$scope.formData || !$scope.formData.email || !$scope.formData.password){
            $scope.error = true;
            return;
        }
        $scope.error = false;

        SessionService.$login({
            email: $scope.formData.email,
            password: $scope.formData.password
        });
    };

})

.controller('LogoutCtrl', function($scope, $location, SessionService, LocalStorageService){
    SessionService.once('logout', function(){
        LocalStorageService.clear();
        $location.path('/welcome1');
    });

    SessionService.$logout();
})

// our controller for the onboarding form
//================================
.controller('OnboardCtrl', function($scope, $location, SessionService, AccountModel, SchoolCollection, CourseCollection){
    if(SessionService.$getAccountInLocalStorage()){
        $location.path('/tab/courses');
    }

    var accountModel = new AccountModel();

    $scope.schools = new SchoolCollection();
    $scope.schools.$fetch();

    $scope.$selectSchool = function(school){
        $scope.formData.school = school;
        $scope.courses = new CourseCollection();
        $scope.courses.$getListBySchool(school.id);
    };
    
    // we will store all of our form data in this object
    $scope.formData = {coursesSelected: []};

    // function to process the form
    $scope.processForm = function() {
        accountModel.firstName = $scope.formData.firstName;
        accountModel.lastName = $scope.formData.lastName;
        accountModel.email = $scope.formData.email;
        accountModel.password = $scope.formData.password; // TODO ASAP: salt this.
        accountModel.school = $scope.formData.school && $scope.formData.school.id;
        accountModel.courses = _.filter($scope.formData.coursesSelected, function(str){ return parseInt(str, 10); });
        if($scope.formData.cumulativeGpa){
            accountModel.cumulativeGpa = $scope.formData.cumulativeGpa;
        }
        if($scope.formData.cumulativeCredits){
            accountModel.cumulativeCredits = $scope.formData.cumulativeCredits;
        }
        // are we going to use this?
        // accountModel.pellGrantTotal = $scope.formData.pellGrantTotal || '';

        accountModel.once('api:successfulCreation', function(){
            $location.path('/tab/courses');
        });
        accountModel.on('api:unsuccessfulCreation', function(){
            $scope.accountCreateError = true;
        });
        accountModel.$encrypt().$save(true);


    };
})

.controller('StudentCtrl', ["$scope", function($scope){

}])

.controller('WelcomeCtrl', function($scope, $location, SessionService){
    if(SessionService.$getAccountInLocalStorage()){
        $location.path('/tab/courses');
    }

    $scope.$goLogin = function(){
        $location.path('/login');
    };
});
