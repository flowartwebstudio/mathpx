/*
    Scene: Play: PlaySub
    Main game, subtraction mode
*/
/*global define */
define(['jquery', 'questions', 'play'], function ($, Questions, Play) {
    'use strict';

    return (function() {
        Play.extend(PlaySub);

        PlaySub.prototype.name = 'PlaySub';
        PlaySub.prototype.route = 'challenges/sub/play';

        PlaySub.prototype.configLeft = 0;
        PlaySub.prototype.configRight = 0;
        PlaySub.prototype.configAnswer = 1;

        function PlaySub(engine, questions, id) {
            // Create the reset function
            this.reset = function(engine, questions, id) {
                this.engine.scenes[this.name] = new PlaySub(engine, questions, id);
                this.engine.changeScenes(this.name);
            }.bind(this, engine, questions, id);

            // If not given a set of questions, get them from localStorage
            if (typeof questions === 'undefined' || questions === null) {
                questions = new Questions('questionsSubtraction');
                questions.fetch();
            }

            PlaySub.__super__.constructor.call(this, engine, questions, id);
        }

        PlaySub.prototype.render = function(ctx, dt) {
            PlaySub.__super__.render.call(this, ctx, dt);
        };

        PlaySub.prototype.setupNumBar = function(numL, numR) {
            PlaySub.__super__.setupNumBar.call(this, this.getQuestion().get('numL'), this.getQuestion().get('numR'));
        };

        PlaySub.prototype.setupAnswer = function(answer) {
            PlaySub.__super__.setupAnswer.call(this, this.getQuestion().get('numL') + this.getQuestion().get('numR'));
        };

        // Menu button click event
        PlaySub.prototype.clickMenu = function() {
            this.engine.changeScenes('MenuChallengesQuestionsSub', require('menuChallengesQuestionsSub'));
        };

        // Next button click event
        PlaySub.prototype.clickNext = function() {
            var nextId = this.getQuestionIdNext();

            // If no next question
            if (nextId === null) {
                // If all questions complete, go to victory
                if (this.questions === null || this.questions.complete()) {
                    this.engine.changeScenes('VictorySub', require('victorySub'));
                }
                // Otherwise go back to the menu
                else {
                    this.engine.changeScenes('MenuChallengesQuestionsSub', require('menuChallengesQuestionsSub'));
                }

            }
            // Otherwise go to the next question in the set
            else {
                this.engine.scenes[this.name] = new PlaySub(this.engine, this.questions, this.getQuestionIdNext());
                this.engine.changeScenes(this.name);
            }
        };

        return PlaySub;

    })();
});
