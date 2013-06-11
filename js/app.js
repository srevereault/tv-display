'use strict';

var breizhcampRoom = angular.module('BreizhcampRoom', []);

var landingTemplate = '<div ng-repeat="day in days" class="day" ng-init="dayIndex=$index">\n';
   landingTemplate += '{{day.date}}\n';
   landingTemplate += '<a ng-href="#/day/{{dayIndex}}/vertical">vertical</a>\n';
   landingTemplate += '<a ng-href="#/day/{{dayIndex}}/horizontal">horizontal</a>\n';
   landingTemplate += '<div ng-repeat="room in day.rooms" class="track">\n';
   landingTemplate += '<a ng-href="#/day/{{dayIndex}}/room/{{$index}}">{{room.name}}</a>\n';
   landingTemplate += '</div>\n';
   landingTemplate += '</div>';
   
var roomTemplate = '<div class="room">\n';
    roomTemplate+= '    <h2>Salle "{{room.name}}"</h2>\n';
    roomTemplate+= '    <div class="currentTalk {{currentTalk.format}}" ng-show="currentTalk">\n';
    roomTemplate+= '        <h3>{{currentTalk.title}} <small>(depuis {{currentTalk.time}})</small></h3>\n';
    roomTemplate+= '        <div class="speakers">\n';
    roomTemplate+= '            <div class="speaker" ng-repeat="speaker in currentTalk.detail.speakers" >\n';
    roomTemplate+= '                <img ng-src="{{speaker.avatar}}">\n';
    roomTemplate+= '                <div class="name">{{speaker.fullname}}</div>\n';
    roomTemplate+= '            </div>\n';
    roomTemplate+= '        </div>\n';
    roomTemplate+= '    </div>\n';
    roomTemplate+= '    <div class="nextTalk {{nextTalk.format}}" ng-show="nextTalk">\n';
    roomTemplate+= '        <h3>A suivre...<br/>{{nextTalk.time}} : <i>{{nextTalk.title}}</i></h3>\n';
    roomTemplate+= '    </div>\n';
    roomTemplate+= '</div>\n';
	
var verticalTemplate = '<div ng-repeat="currentTalk in currentTalks" ng-show="currentTalk.css !== \'unzoom\'">\n';
    verticalTemplate+= '    <div class="{{{true:\'currentTalk\', false:\'talk\'}[currentTalk.css === \'zoom\']}} {{currentTalk.css}}">\n';
    verticalTemplate+= '        <h3>{{currentTalk.title}} <small>(depuis {{currentTalk.time}})</small></h3>\n';
    verticalTemplate+= '        <div class="speakers">\n';
    verticalTemplate+= '            <div class="speaker"ng-repeat="speaker in currentTalk.detail.speakers" >\n';
    verticalTemplate+= '                <img ng-src="{{speaker.avatar}}">\n';
    verticalTemplate+= '                <div class="name">{{speaker.fullname}}</div>\n';
    verticalTemplate+= '            </div>\n';
    verticalTemplate+= '        </div>\n';
    verticalTemplate+= '    </div>\n';
    verticalTemplate+= '    <div class="nextTalk {{currentTalk.css}}" ng-show="nextTalks[$index] && currentTalk.css === \'zoom\'">\n';
    verticalTemplate+= '        <h3>A suivre...<br/>{{nextTalks[$index].time}} : <i>{{nextTalks[$index].title}}</i></h3>\n';
    verticalTemplate+= '    </div>\n';
    verticalTemplate+= '</div>\n';
	
var horizontalTemplate = '<div class="trackTalks">\n';
    horizontalTemplate+= '    <div ng-repeat="roomTalk in roomsTalks" class="trackTalk" ng-class="{highlighted: $index == highlightedIndex}">\n';
    horizontalTemplate+= '        <h2>Salle "{{roomTalk.name}}"</h2>\n';
    horizontalTemplate+= '        <div class="currentTalk {{roomTalk.currentTalk.format}}" ng-show="roomTalk.currentTalk">\n';
    horizontalTemplate+= '            <h3>{{roomTalk.currentTalk.title}} <small>(début à {{roomTalk.currentTalk.time}})</small></h3>\n';
    horizontalTemplate+= '            <div class="talkDetail" ng-show="$index == highlightedIndex">\n';
    horizontalTemplate+= '                <p ng-bind-html-unsafe="getSafeDescription(roomTalk.currentTalk.detail.description)"></p>\n';
    horizontalTemplate+= '            </div>\n';
    horizontalTemplate+= '        </div>\n';
    horizontalTemplate+= '        <div class="speakers">\n';
    horizontalTemplate+= '            <div class="speaker" ng-repeat="speaker in roomTalk.currentTalk.detail.speakers" >\n';
    horizontalTemplate+= '                <div class="icon"><img ng-src="{{speaker.avatar}}" /></div>\n';
    horizontalTemplate+= '                {{speaker.fullname}}\n';
    horizontalTemplate+= '            </div>\n';
    horizontalTemplate+= '        </div>\n';
    horizontalTemplate+= '        <div class="nextTalk {{roomTalk.nextTalk.format}}" ng-show="roomTalk.nextTalk">\n';
    horizontalTemplate+= '            <h3>A suivre...<br/>{{roomTalk.nextTalk.time}} : <i>{{roomTalk.nextTalk.title}}</i></h3>\n';
    horizontalTemplate+= '        </div>\n';
    horizontalTemplate+= '    </div>\n';
    horizontalTemplate+= '</div>\n';

breizhcampRoom.config(function($routeProvider) {

    $routeProvider.
        when('/', {
            controller: 'LandingController',
			template: landingTemplate
            //templateUrl: 'partials/landing.html'
        }).
        when('/day/:dayId/room/:roomId', {
            controller: 'RoomController',
            template: roomTemplate
        }).
        when('/day/:dayId/vertical', {
            controller: 'DayVerticalController',
            template: verticalTemplate
        }).
        when('/day/:dayId/horizontal', {
            controller: 'DayHorizontalController',
            template: horizontalTemplate
        });
});