// MODULE
var weatherApp = angular.module('weatherApp', ['ngRoute','ngResource']);

weatherApp.config(function($routeProvider){
    $routeProvider
    .when('/',{
        templateUrl:'pages/home.htm',
        controller:'homeController'
    }
    )
    .when('/forecast',{
        templateUrl:'pages/forecast.htm',
        controller:'forecastController'
    } )

    .when('/forecast/:days', {
        templateUrl: 'pages/forecast.htm',
        controller: 'forecastController'
    })
});

weatherApp.service('cityService', function(){
    this.city="";
});

weatherApp.service('weatherService', ['$resource', function ($resource) {
    this.GetWeather = function (city, days) {
        var weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily", { callback: 'JSON_CALLBACK' }, { get: { method: 'JSONP' } });
        return weatherAPI.get({ q: city, cnt: days, appid: 'bd5e378503939ddaee76f12ad7a97608' });
    }
}]);


weatherApp.controller('homeController',['$scope','cityService', '$location',function($scope, cityService,$location) {
    $scope.city=cityService.city;

    $scope.$watch('city',function(){
        cityService.city= $scope.city;
    });

    $scope.submit= function(){
        $location.path("/forecast");
    }
  

}]);

weatherApp.controller('forecastController', ['$scope', '$routeParams', 'cityService', 'weatherService', function ($scope, $routeParams, cityService, weatherService) {
  
    
    $scope.city = cityService.city;
    
    $scope.days = $routeParams.days || 1;
    
    $scope.weatherResult = weatherService.GetWeather($scope.city,$scope.days);

    $scope.convertToFahrenheit = function(degK) {
        
        return Math.round((1.8 * (degK - 273)));
        
    }
    
    $scope.convertToDate = function(dt) { 

        const ISTOffset = 330 * 60 * 1000;
      
        return new Date(dt * 1000);
        
    };

    console.log($scope.weatherResult);

}]);

// weatherApp.directive("weatherReport", function() {
//     return {
//         restrict: 'E',
//         templateUrl: 'directives/weatherReport.html',
//         replace: true,
//         scope: {
//             weatherDay: "=",
//             convertToStandard: "&",
//             convertToDate: "&",
//             dateFormat: "@"
//         }
//     }
//  });

