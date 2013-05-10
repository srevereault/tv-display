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
});