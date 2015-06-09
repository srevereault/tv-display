'use strict';

var breizhcampRoom = angular.module('BreizhcampRoom', []);


breizhcampRoom.controller('ScheduleController', function ($scope, $http, $timeout, $filter, $location) {

    $scope.day = $location.search()['day'];

    $scope.updateTime = function() {
		var now = new Date();

		//select right day if not defined
		if (!$scope.day) {
			$scope.day = 0;

			var curDay = $filter('date')(now, "dd/MM/yyyy");
			for (var i = 0; i < $scope.schedule.programme.jours.length; i++) {
				if (curDay == $scope.schedule.programme.jours[i].date) {
					$scope.day = i;
					break;
				}
			}
		}


        $scope.time = $filter('date')(now, "H:mm");
        $scope.timeInSeconds = now.getHours() * 60 + now.getMinutes();


        $scope.talks = [];
        $scope.talksByRoom = {};
        $scope.nextTalks = [];
        $scope.nextTalksByRoom = {};


        angular.forEach($scope.schedule.programme.jours[$scope.day].proposals, function(talk) {
            if ($scope.isOnAir(talk)) {
                $scope.talks.push(talk);
                $scope.talksByRoom[talk.room] = talk;
            }

            if ($scope.isAfter(talk)) {
                $scope.nextTalksByRoom[talk.room] = talk;
            }
        });

        angular.forEach($scope.nextTalksByRoom, function(talk) {
            $scope.nextTalks.push(talk);
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
        var afterTime = $scope.timeInSeconds;
        var currentTalk = $scope.talksByRoom[talk.room];
        if (currentTalk) {
            afterTime =  $scope.getTimeInSeconds(currentTalk.end);
        }
        var beforeTime = $scope.getTimeInSeconds("23:59");
        var nextTalk = $scope.nextTalksByRoom[talk.room];
        if (nextTalk) {
            beforeTime = $scope.getTimeInSeconds(nextTalk.start);
        }
        return afterTime < startInSeconds && startInSeconds < beforeTime;
    };

    $scope.getTimeInSeconds = function(time) {
        var splits = time.split(':');
        return parseInt(splits[0]) * 60 + parseInt(splits[1]);
    };

    window.getSchedule = function(schedule) {
        $scope.schedule = schedule;
        $scope.updateTime();
    };

    $http.get("http://www.breizhcamp.org/json/schedule.json").success(function(data) {
        $scope.schedule = data;
        $scope.updateTime();
    });

});
