/*
   Scene: MenuLearning
   The menu for the Learning mode
*/
/*global define */
define(['jquery', 'play', 'playQuiz', 'menuChallenges', 'about', 'chalkHouse', 'textPx', 'textPxTitle', 'buttonPx', 'buttonBack'], function ($, Play, PlayQuiz, MenuChallenges, About, ChalkHouse, TextPx, TextPxTitle, ButtonPx, ButtonBack) {
    'use strict';

    return (function() {
        hoopty.scenes.Scene.extend(MenuLearning);

        MenuLearning.prototype.name = 'MenuLearning';

        function MenuLearning(engine) {
            MenuLearning.__super__.constructor.call(this, engine);

            // Create the background image
            var spriteImage = $('img.gettable.gettable-chalkboard-bg').attr('src');
            this.entityAdd(new hoopty.entities.Sprite(0, 0, this.engine.ctx.canvas.width, this.engine.ctx.canvas.height, spriteImage, 0, 0, 96, 64));

            // Create the fun chalk dude!
            this.entityAdd(new ChalkHouse(740, 100));

            // Create the title
            var centerX = Math.round(this.engine.ctx.canvas.width / 3);
            this.entityAdd(new ButtonBack(this.clickBack.bind(this)));
            this.entityAdd(new TextPxTitle());
            this.entityAdd(new TextPx(centerX - 20, 70, 300, 'Learning Mode'));

            // Create the big play button
            this.entityAdd(new ButtonPx(centerX, 360, 'Play!', this.clickPlay.bind(this)));
        }

        MenuLearning.prototype.render = function(ctx, dt) {
            MenuLearning.__super__.render.call(this, ctx, dt);
        };

        // On clicking the Play button
        MenuLearning.prototype.clickPlay = function() {
            this.engine.scenes['PlayQuiz'] = new PlayQuiz(this.engine, null, null, MenuLearning); //this.questions, this.getQuestionIdNext());
            this.engine.changeScenes('PlayQuiz');
        };

        // Back button click
        MenuLearning.prototype.clickBack = function(event) {
            this.engine.changeScenes('Menu', require('menu'));
        };

        return MenuLearning;

    })();
});
