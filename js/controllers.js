'use strict';

breizhcampRoom.controller('TimeController',
    function TimeController($rootScope, $scope, $timeout, $filter) {

        $scope.schedule = function() {
            $scope.time = $filter('date')(new Date(), "HH:mm");

            $rootScope.$broadcast('timeChanged');

            $timeout($scope.schedule, 60000);
        };

        $scope.schedule();
    }
);

breizhcampRoom.controller('RoomsController',
    function RoomsController($scope, programService) {

        $scope.loading = true;

        programService.getProgram(function(program) {
            $scope.program = program;

            $scope.days = $scope.program.jours;

            $scope.loading = false;
        });

    }
);

breizhcampRoom.controller('DayController',
    function RoomController($scope, $routeParams, $filter, programService) {

        $scope.loading = true;

        $scope.getNextTalkIndex = function(track) {
            var index = 0;
            var time = new Date().getHours() * 100 + new Date().getMinutes();
            angular.forEach(track.talks, function(talk) {
                if (parseInt(talk.time.replace(':','')) < time) {
                    index++;
                }
            });
            return index;
        };

        $scope.getTalks = function() {

            if ($scope.tracks) {
                $scope.currentTalks = [];
                $scope.nextTalks = [];

                angular.forEach($scope.tracks, function(track) {
                    console.log(track);
                    var nextTalkIndex = $scope.getNextTalkIndex(track);
                    $scope.currentTalks.push(track.talks[nextTalkIndex - 1]);
                    programService.getTalk(track.talks[nextTalkIndex - 1], function(talkDetailled) {
                        track.talks[nextTalkIndex - 1].detail = talkDetailled;
                    });
                    $scope.nextTalks.push(track.talks[nextTalkIndex]);
                });
            }
        };

        $scope.$on('timeChanged', function() {
            $scope.getTalks();
        });

        programService.getProgram(function(program) {
            $scope.program = program;

            $scope.dayTalks = [];

            $scope.tracks = program.jours[parseInt($routeParams.dayId)].tracks;

            $scope.getTalks();

            $scope.loading = false;
        });

    }
);

breizhcampRoom.controller('RoomController',
    function RoomController($scope, $routeParams, $filter, programService) {

        $scope.loading = true;

        $scope.getNextTalkIndex = function() {
            var index = 0;
            var time = new Date().getHours() * 100 + new Date().getMinutes();
            angular.forEach($scope.track.talks, function(talk) {
                if (parseInt(talk.time.replace(':','')) < time) {
                    index++;
                }
            });
            return index;
        };

        $scope.getTalks = function() {
            if ($scope.track) {
                var nextTalkIndex = $scope.getNextTalkIndex();
                $scope.currentTalk = $scope.track.talks[nextTalkIndex - 1];
                programService.getTalk($scope.currentTalk, function(talkDetailled) {
                    $scope.currentTalk.detail = talkDetailled;
                });
                $scope.nextTalk = $scope.track.talks[nextTalkIndex];
                programService.getTalk($scope.nextTalk, function(talkDetailled) {
                    $scope.nextTalk.detail = talkDetailled;
                });
                $scope.index++;
            }
        };

        $scope.$on('timeChanged', function() {
            $scope.getTalks();
        });

        programService.getProgram(function(program) {
            $scope.program = program;

            $scope.track = $scope.program.jours[parseInt($routeParams.dayId)].tracks[parseInt($routeParams.roomId)];

            $scope.getTalks();

            $scope.loading = false;
        });

    }
);