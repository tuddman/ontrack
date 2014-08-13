angular.module('ontrack.factories').factory('AccountModel', function(BaseModel, md5){
    var name = 'Account',
        apiUrl = '/account',
        specialLocalStorageKey = 'ACCOUNT';

    function AccountModel(){
        BaseModel.apply(this, arguments);
    }

    AccountModel.prototype = new BaseModel();

    AccountModel.prototype.$getName = function(){
        return name;
    };

    AccountModel.prototype.$getApiUrl = function(){
        return apiUrl;
    };

    AccountModel.prototype.$getSpecialLocalStorageKey = function(){
        return specialLocalStorageKey;
    };

    AccountModel.prototype.$getCurrentQualityPts = function(){
        var qualityPts = 0;
        _.each(this.courses, function(course){
            if(isGradePassing(course.grade)){
                qualityPts += (getPointsByGrade(course.grade) * course.credits);
            }
        });

        return qualityPts;
    };

    AccountModel.prototype.$getCurrentGPA = function(){
        var gpa = this.$getCurrentQualityPts() / this.$getTotalCurrentCreditHours();
        return (gpa && gpa !== Infinity)  ? gpa.toFixed(3) : '0.0';
    };

    AccountModel.prototype.$getCumulativeGPA = function() {
        
        var startingQualityPts = (this.cumulativeCredits * this.cumulativeGpa) || 0;
        var attemptingCreditHrs = 0;
        _.each(this.courses, function(course) {
            attemptingCreditHrs += course.credits;
        });
        var currentQualityPts = 0;
        _.each(this.courses, function(aCourse) {
                 currentQualityPts += getPointsByGrade(aCourse.grade) * aCourse.credits;
        });
        var gpa = ( (startingQualityPts) + (currentQualityPts) )  / ( (this.cumulativeCredits) + (attemptingCreditHrs) );
        return (gpa && gpa !== Infinity) ?  gpa.toFixed(3) : '0.0';
    };

    AccountModel.prototype.$getTotalCurrentCreditHours = function(){
        var total = 0;
        _.each(this.courses, function(course){
            if(isGradePassing(course.grade)){
                total += course.credits || 0;
            }
        });
        return total;
    };

    AccountModel.prototype.$getTotalCompletedCreditHours = function(){
        return this.cumulativeCredits || 0;
    };

    AccountModel.prototype.$getTotalCumulativeCreditHours = function() {
        return (this.$getTotalCompletedCreditHours() + this.$getTotalCurrentCreditHours());
    };

    function isGradePassing(grade){
        return (grade !== 'F' && grade !== 'D-');
    }

    // setup for CUNY:
    function getPointsByGrade(letterGrade) {
        switch (letterGrade) {
            case 'A':
                return 4.0;
                break;
            case 'A-':
                return 3.7;
                break;
            case 'B+':
                return 3.3;
                break;
            case 'B':
                return 3.0;
                break;
            case 'B-':
                return 2.7;
                break;
            case 'C+':
                return 2.3;
                break;
            case 'C':
                return 2.0;
                break;
            case 'C-':
                return 1.7;
                break;
            case 'D+':
                return 1.3;
                break;
            case 'D':
                return 1.0;
                break;
            case 'D-':
                return 0.7;
                break;
            case 'F':
                return 0.0;
                break;
            default:
                return 'N/A';
                break;
        }
    }

    AccountModel.prototype.$encrypt = function(){
        if(this.password){
            this.password = md5.createHash(this.password);
        }
        return this;
    };

    return AccountModel;
});
