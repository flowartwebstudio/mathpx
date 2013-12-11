/*global define, alert */
define(["backbone", "start", "menu", "menuChallenges", "menuChallengesAdd", "play", "playAdd", "playSub"], function (Backbone, Start, Menu, MenuChallenges, MenuChallengesAdd, Play, PlayAdd, PlaySub) {
    "use strict";

    return Backbone.Router.extend({

        routes: {
            "":                     "start",
            "main":                 "main",
            "challenges":           "challenges",
            "challenges/add":       "challengesAdd",
            "challenges/add/play":  "challengesAddPlay",
            "challenges/sub":       "challengesSub",
            "challenges/sub/play":  "challengesSub",
            "play":                 "play",
            "free":                 "free",
            "about":                "about",
            "*path":                "start"
        },

        // Must be created with an engine so that scenes can be changed
        initialize: function(engine) {
            this.engine = engine;
        },

        start: function() {
            this.changeSceneTo("Start", Start);
        },

        main: function() {
            this.changeSceneTo("Menu", Menu);
        },

        challenges: function() {
            this.changeSceneTo("MenuChallenges", MenuChallenges);
        },

        challengesAdd: function() {
            this.changeSceneTo("MenuChallengesAdd", MenuChallengesAdd);
        },

        challengesAddPlay: function() {
            this.changeSceneTo("PlayAdd", PlayAdd);
        },

        challengesSub: function() {
            //this.changeSceneTo("MenuChallengesSub", MenuChallengesSub);
        },

        challengesSubPlay: function() {
            this.changeSceneTo("PlaySub", PlaySub);
        },

        play: function() {
            this.changeSceneTo("Play", Play);
        },

        // Change the scene to the given scene via loading
        changeSceneTo: function(name, Type) {
            // If the scene doesn't already exist, create it
            if (!this.engine.scenes.hasOwnProperty(name)) {
                this.engine.sceneAdd(new Type(this.engine), name);
            }

            // Change to the scene
            this.engine.scenes.Loading.sceneNameChangeTo = name;
            this.engine.changeScenes("Loading");
        },

    });
});
