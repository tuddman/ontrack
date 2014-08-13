/*
    IMPORTANT: requires Lo-Dash (http://lodash.com/) or Underscore.js (http://underscorejs.org/)
 
    Usage: ng-repeat="item in items | fuzzyFilter:searchText"
*/

'use strict';
 
angular.module('ontrack.filters', [])
 
.filter('fuzzyFilter', function () {
    return function (items, searchText) {
        var searchWords;
    
        if (searchText) {
            searchWords = searchText.split(' ');
    
            return _.filter(items, function (item) {
                var itemText = _.values(item).join(' ').toLowerCase();
    
                return _.every(searchWords, function (searchWord) {
                    return itemText.search(searchWord.toLowerCase()) !== -1;
                });
            });
        } else {
            return [];
        }
    };
});
