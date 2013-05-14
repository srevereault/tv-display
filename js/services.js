'use strict';

breizhcampRoom.service('programService', function ProgramService($http) {
    var self = this;

    var timeBeforeTalkToDisplay = 20;

    self.program = null;

    self.getProgram = function(callback) {

        if (self.program) {
            callback(self.program);
        }
        else {
            $http.jsonp("http://cfp.breizhcamp.org/programme/jsonp?callback=JSON_CALLBACK")
                .success(function(data) {
                    angular.forEach(data.programme.jours, function(jour) {
                        var indexToRemove = undefined;
                        angular.forEach(jour.tracks, function(track, index) {
                            if (track.type === "keynote") {
                                indexToRemove = index;
                            }
                        });
                        if (indexToRemove !== undefined) {
                            jour.tracks.splice(indexToRemove, 1);
                        }
                    });
                    self.program = data.programme;
                    callback(self.program);
                });
        }
    };

    self.talks = [];

    self.getTalk = function(talk, callback) {
        if (talk && talk.id) {
            if (self.talks[talk.id]) {
                callback(self.talks[talk.id]);
            } else {
                $http.jsonp("http://cfp.breizhcamp.org/accepted/talk/" + talk.id + "/jsonp?callback=JSON_CALLBACK")
                    .success(function(data) {
                        angular.forEach(data.speakers, function(speaker){
                            // Optim gravatar
                            if (speaker.avatar && speaker.avatar.indexOf("gravatar") !== -1) {
                                speaker.avatar = speaker.avatar + "&s=200";
                            }
                            // Optim twitter
                            if (speaker.avatar && speaker.avatar.indexOf("twimg") !== -1) {
                                if (speaker.avatar.indexOf("_normal") !== -1) {
                                    speaker.avatar = speaker.avatar.replace("_normal", "");
                                }
                            }
                        });
                        self.talks[talk.id] = data;
                        callback(self.talks[talk.id]);
                    });
            }
        }
    };

    self.getNextTalkIndex = function(track) {
        var index = 0;
        var minutes = new Date().getMinutes() + timeBeforeTalkToDisplay;
        var hours = new Date().getHours();
        while (minutes >= 60) {
            minutes = minutes - 60;
            hours = hours + 1;
        }
        var time = hours * 100 + minutes;
        angular.forEach(track.talks, function(talk) {
            if (parseInt(talk.time.replace(':','')) <= time) {
                index++;
            }
        });
        if (index === 0) {
            index = 1;
        }
        return index;
    };
});


breizhcampRoom.service('twitterService', function($http) {
    var self = this;

    self.getTweets = function(callback) {

        $http.jsonp("https://search.twitter.com/search.json?q=breizhcamp&rpp=20&callback=JSON_CALLBACK")
            .success(function(data) {
                callback(data.results);
            });

    }

});