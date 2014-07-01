(function (angular) {

    var app = angular.module("Application", []);


    /*
    * <div auto-height data-offset="100"></div>
    *
    */
    app.directive('autoHeight', [function () {
	    return {
	        restrict: 'A',
	        link: function ($scope, elem, attrs) {
	            $(elem).autoheight();
	        }
	    };
	}]);

})(angular);