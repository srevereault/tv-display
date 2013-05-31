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

breizhcampRoom.controller('LandingController',
    function ($scope, programService) {

        programService.getProgram(function(program) {
            $scope.program = program;
            $scope.days = $scope.program.jours;
        });

    }
);

breizhcampRoom.controller('DayVerticalController',
    function ($scope, $routeParams, $filter, programService, $timeout, $log) {

        $scope.timeWithAll = 20000;
        $scope.timeWithOne = 10000;

        $scope.getTalks = function() {

            if ($scope.tracks) {
                $scope.currentTalks = [];
                $scope.nextTalks = [];

                angular.forEach($scope.tracks, function(track) {
                    var nextTalkIndex = programService.getNextTalkIndex(track);
                    $scope.currentTalks.push(track.talks[nextTalkIndex - 1]);
                    programService.getTalk(track.talks[nextTalkIndex - 1], function(talkDetailled) {
                        track.talks[nextTalkIndex - 1].detail = talkDetailled;
                    });
                    $scope.nextTalks.push(track.talks[nextTalkIndex]);
                });
            }
        };

        $scope.zoomOneTalk = function(index) {
            angular.forEach($scope.currentTalks, function(talk) {
                talk.css = 'unzoom';
            });
            $scope.currentTalks[index].css = 'zoom';
        };

        $scope.unzoomAll = function() {
            angular.forEach($scope.currentTalks, function(talk) {
                talk.css = undefined;
            });
        };

        $scope.firstZoom = function() {
            $log.info('firstZoom');
            $scope.currentIndex = 0;
            $scope.zoomOneTalk($scope.currentIndex);
            $timeout($scope.nextZoom, $scope.timeWithOne);
        };

        $scope.nextZoom = function() {
            $log.info('nextZoom');
            $scope.currentIndex = $scope.currentIndex + 1;
            if ($scope.currentIndex < $scope.currentTalks.length) {
                $scope.zoomOneTalk($scope.currentIndex);
                $timeout($scope.nextZoom, $scope.timeWithOne);
            } else {
                $scope.unzoomAll();
                $timeout($scope.firstZoom, $scope.timeWithAll);
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


            $timeout(function() {
                $scope.firstZoom();
            }, $scope.timeWithAll);

        });

    }
);

breizhcampRoom.controller('DayHorizontalController',
    function ($scope, $routeParams, $filter, programService, $timeout, $log) {


        $scope.converter = new Markdown.getSanitizingConverter();

        $scope.getSafeDescription = function(description) {
            if (description) {
                return $scope.converter.makeHtml(description);
            }
            return "";
        };

        $scope.highlightedIndex = -3;

        $scope.getTalks = function() {

            if ($scope.rooms) {
                $scope.roomsTalks = [];

                angular.forEach($scope.rooms, function(room) {

                    var roomTalk = { name: room.name };

                    var nextTalkIndex = programService.getNextTalkIndex(room);
                    roomTalk.currentTalk = room.talks[nextTalkIndex - 1];
                    programService.getTalk(room.talks[nextTalkIndex - 1], function(talkDetailled) {
                        room.talks[nextTalkIndex - 1].detail = talkDetailled;
                    });

                    roomTalk.nextTalk = room.talks[nextTalkIndex];

                    $scope.roomsTalks.push(roomTalk);
                });
            }
        };

        $scope.zoom = function() {
            // 2 fake indexes to show all the talks together
            $scope.highlightedIndex = ($scope.highlightedIndex + 1) % ($scope.roomsTalks.length + 2);
            $timeout($scope.zoom, 10000);
        };

        $scope.$on('timeChanged', function() {
            $scope.getTalks();
        });

        programService.getProgram(function(program) {
            $scope.program = program;

            $scope.rooms = program.jours[parseInt($routeParams.dayId)].rooms;

            $scope.getTalks();

            $scope.zoom();
        });

    }
);

breizhcampRoom.controller('RoomController',
    function ($scope, $routeParams, $location, $filter, $timeout, programService) {

        $scope.getTalks = function() {
            if ($scope.room) {
                var nextTalkIndex = programService.getNextTalkIndex($scope.room);
                $scope.currentTalk = $scope.room.talks[nextTalkIndex - 1];
                programService.getTalk($scope.currentTalk, function(talkDetailled) {
                    $scope.currentTalk.detail = talkDetailled;
                });
                $scope.nextTalk = $scope.room.talks[nextTalkIndex];
            }
        };

        $scope.$on('timeChanged', function() {
            $scope.getTalks();
        });

        programService.getProgram(function(program) {
            $scope.program = program;
            $scope.room = $scope.program.jours[parseInt($routeParams.dayId)].rooms[parseInt($routeParams.roomId)];

            $scope.getTalks();
        });

    }
);

breizhcampRoom.controller('TweetsController',
    function ($scope, $timeout, twitterService) {

        $scope.left = 0;
        $scope.tweetwall = angular.element('.tweetwall');

        $scope.getTweets = function() {
            twitterService.getTweets(function(tweets) {
                $scope.left = 0;
                $scope.tweets = tweets;
            })
        };

        $scope.scroll = function() {
            $scope.tweetwall.css('left', -$scope.left + "px");
            $scope.left += 312;
            $timeout($scope.scroll, 5000);
        }

        $scope.$on('timeChanged', function() {
            $scope.getTweets();
        });

        $scope.getTweets();
        $scope.scroll();
    }
);