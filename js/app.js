'use strict';

var breizhcampRoom = angular.module('BreizhcampRoom', []);

breizhcampRoom.config(function($routeProvider) {

    $routeProvider.
        when('/', {
            controller: 'LandingController',
            templateUrl: 'partials/landing.html'
        }).
        when('/day/:dayId/track/:roomId', {
            controller: 'TrackController',
            templateUrl: 'partials/track.html'
        }).
        when('/day/:dayId/vertical', {
            controller: 'DayVerticalController',
            templateUrl: 'partials/vertical.html'
        }).
        when('/day/:dayId/horizontal', {
            controller: 'DayHorizontalController',
            templateUrl: 'partials/horizontal.html'
        });
});