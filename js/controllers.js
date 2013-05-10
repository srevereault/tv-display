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
                $scope.nextTalk = $scope.track.talks[nextTalkIndex];
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