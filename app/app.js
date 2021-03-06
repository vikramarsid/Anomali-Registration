'use strict';

// Declaring app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'ngMessages',
    'myApp.registration'
]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/registration'});
}]);
