'use strict';

breizhcampRoom.service('programService', function ProgramService($http) {
    var self = this;

    self.program = null;

    self.getProgram = function(callback) {

        if (self.program) {
            callback(self.program);
        }
        else {
            $http.jsonp("http://cfp.breizhcamp.org/programme/jsonp?callback=JSON_CALLBACK")
                .success(function(data) {
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
    }
});