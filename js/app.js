﻿'use strict';

var breizhcampRoom = angular.module('BreizhcampRoom', []);


breizhcampRoom.controller('ScheduleController', function ($scope, $http, $timeout, $filter, $location) {

    $scope.day = $location.search()['day'];
    if (!$scope.day) {
        $location.search('day','0');
        $scope.day = 0;
    }

    $scope.updateTime = function() {

        $scope.time = $filter('date')(new Date(), "H:mm");
        $scope.timeInSeconds = new Date().getHours() * 60 + new Date().getMinutes();

        $scope.talks = [];
        $scope.nextTalks = [];

        angular.forEach($scope.schedule.programme.jours[$scope.day].tracks, function(track) {
            var takeNext = true;
            angular.forEach(track.proposals, function(talk) {

                if ($scope.isOnAir(talk)) {
                    $scope.talks.push(talk);
                }

                if (takeNext && $scope.isAfter(talk)) {
                    $scope.nextTalks.push(talk);
                    takeNext = false;
                }

            });
        });

        $timeout($scope.updateTime, 60000);
    };

    $scope.isOnAir = function(talk) {
        var startInSeconds = $scope.getTimeInSeconds(talk.start);
        var endInSeconds = $scope.getTimeInSeconds(talk.end);
        return startInSeconds <= $scope.timeInSeconds && endInSeconds > $scope.timeInSeconds;
    };

    $scope.isAfter = function(talk) {
        var startInSeconds = $scope.getTimeInSeconds(talk.start);
        return startInSeconds > $scope.timeInSeconds;
    };

    $scope.getTimeInSeconds = function(time) {
        var splits = time.split(':');
        return parseInt(splits[0]) * 60 + parseInt(splits[1]);
    };

    $http.get("data/schedule.json").success(function(schedule) {
        $scope.schedule = schedule;
        $scope.updateTime();
    });

});
