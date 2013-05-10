'use strict';

var breizhcampRoom = angular.module('BreizhcampRoom', []);

breizhcampRoom.config(function($routeProvider) {

    $routeProvider.
        when('/', {
            controller: 'RoomsController',
            templateUrl: 'partials/rooms.html'
        }).
        when('/day/:dayId/room/:roomId', {
            controller: 'RoomController',
            templateUrl: 'partials/room.html'
        });
});