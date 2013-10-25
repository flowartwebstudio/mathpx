/*
    Scene: Play
    The main game scene
*/
/*global define */
define(["jquery", "backbone", "question", "scene", "entity", "num", "numNeg", "text", "trash", "button", "tween"], function ($, Backbone, Question, Scene, Entity, Num, NumNeg, Text, Trash, Button, Tween) {
    "use strict";

    return (function() {
        Scene.extend(Play);

        Play.prototype.name = "Play";

        // Current question
        Play.prototype.question = null;

        // UI
        Play.prototype.textLeft = null;
        Play.prototype.textSign = null;
        Play.prototype.textRight = null;
        Play.prototype.textEquals = null;
        Play.prototype.textAnswer = null;
        Play.prototype.toolbarNumL = null;
        Play.prototype.toolbarNumR = null;
        Play.prototype.toolbarNumNegL = null;
        Play.prototype.toolbarNumNegR = null;
        Play.prototype.toolbarNumLText = null;
        Play.prototype.toolbarNumRText = null;
        Play.prototype.toolbarTrashL = null;
        Play.prototype.toolbarTrashR = null;
        Play.prototype.answerNums = [];
        Play.prototype.answerNumsNeg = [];

        function Play(engine) {
            Play.__super__.constructor.call(this, engine);

            // Create the lines
            this.entityAdd(new Entity(this.engine.ctx.canvas.width / 3, 100, 4, this.engine.ctx.canvas.height - 200, "rgb(255, 255, 255)"));
            this.entityAdd(new Entity(2 * this.engine.ctx.canvas.width / 3, 100, 4, this.engine.ctx.canvas.height - 200, "rgb(255, 255, 255)"));

            // Create the number bar
            this.textLeft = this.entityAdd(new Text(Math.round(this.engine.ctx.canvas.width / 6), 40, 100, "0", "24px 'Press Start 2P'", "rgb(255, 255, 255)"));
            this.textSign = this.entityAdd(new Text(Math.round(this.engine.ctx.canvas.width / 3), 40, 100, "+", "24px 'Press Start 2P'", "rgb(255, 255, 255)"));
            this.textRight = this.entityAdd(new Text(Math.round(this.engine.ctx.canvas.width / 2), 40, 100, "0", "24px 'Press Start 2P'", "rgb(255, 255, 255)"));
            this.textEquals = this.entityAdd(new Text(Math.round(2 * this.engine.ctx.canvas.width / 3), 40, 100, "=", "24px 'Press Start 2P'", "rgb(255, 255, 255)"));
            this.textAnswer = this.entityAdd(new Text(Math.round(5 * this.engine.ctx.canvas.width / 6), 40, 100, "0", "24px 'Press Start 2P'", "rgb(255, 255, 255)"));

            // Create all possible toolbar entities 
            this.toolbarNumLText = this.entityAdd(new Text(20, this.engine.ctx.canvas.height - 40, 100, "+", "24px 'Press Start 2P'", "rgb(255, 255, 255)"));
            this.toolbarNumL = this.entityAdd(new Num(50, this.engine.ctx.canvas.height - 80, 2 * this.engine.ctx.canvas.width / 3, this.engine.ctx.canvas.height, true, false));
            this.toolbarNumNegL = this.entityAdd(new NumNeg(50, this.engine.ctx.canvas.height - 80, 2 * this.engine.ctx.canvas.width / 3, this.engine.ctx.canvas.height, true, false));
            this.toolbarNumRText = this.entityAdd(new Text(350, this.engine.ctx.canvas.height - 40, 100, "-", "24px 'Press Start 2P'", "rgb(255, 255, 255)"));
            this.toolbarNumR = this.entityAdd(new Num(380, this.engine.ctx.canvas.height - 80, 2 * this.engine.ctx.canvas.width / 3, this.engine.ctx.canvas.height, true, false));
            this.toolbarNumNegR = this.entityAdd(new NumNeg(380, this.engine.ctx.canvas.height - 80, 2 * this.engine.ctx.canvas.width / 3, this.engine.ctx.canvas.height, true, false));
            this.toolbarTrashL = this.entityAdd(new Trash(234, this.engine.ctx.canvas.height - 80));
            this.toolbarTrashR = this.entityAdd(new Trash(560, this.engine.ctx.canvas.height - 80));
            this.entityAdd(new Button(740, this.engine.ctx.canvas.height - 70, 80, 40, "Go!", "20px 'Press Start 2P'", "rgb(255, 255, 255)", this.clickGo(), 16, "rgb(255, 255, 255)"));
            this.entityAdd(new Button(840, this.engine.ctx.canvas.height - 70, 80, 40, "Menu", "20px 'Press Start 2P'", "rgb(255, 255, 255)", this.clickMenu(), 16, "rgb(255, 255, 255)"));

            // Create the answer numbers
            this.answerNums = [];
            for (var i = 0; i < 40; i++) {
                var num = new Num(this.engine.ctx.canvas.width - (3 * this.engine.ctx.canvas.width / 12) + 40 * (i % 5), 60 + 60 * Math.floor(i / 5), null, null, false, false);
                this.answerNums.push(this.entityAdd(num));
                this.answerNums[i].display = false;
            }
            this.answerNumsNeg = [];
            for (i = 0; i < 40; i++) {
                var numNeg = new NumNeg(this.engine.ctx.canvas.width - (3 * this.engine.ctx.canvas.width / 12) + 40 * (i % 5), 60 + 60 * Math.floor(i / 5), null, null, false, false);
                this.answerNumsNeg.push(this.entityAdd(numNeg));
                this.answerNumsNeg[i].display = false;
            }

            // Set up the UI
            this.toolbarNumL.display = true;
            this.toolbarNumNegL.display = false;
            this.toolbarNumLText.text = "+";
            this.toolbarNumR.display = false;
            this.toolbarNumNegR.display = true;
            this.toolbarNumRText.text = "-";
            this.toolbarTrashL.display = false;
            this.toolbarTrashR.display = true;

        }

        Play.prototype.render = function(ctx, dt) {
            // Set the background
            ctx.fillStyle = "rgb(87, 124, 75)";
            ctx.fillRect (0, 0, ctx.canvas.width, ctx.canvas.height);

            // Setup the number bar
            var leftCount = this.getLeftCount(ctx);
            var rightCount = this.getRightCount(ctx);
            this.setupNumBar(leftCount, rightCount);

            // Render the answer
            this.setupAnswer(leftCount + rightCount);

            // Render entities
            Play.__super__.render.call(this, ctx, dt);
        };

        // Setup the number bar numbers and signs
        Play.prototype.setupNumBar = function(numL, numR) {
            this.textLeft.text = numL;
            if (numR < 0) {
                this.textSign.text = "-";
            }
            else {
                this.textSign.text = "+";
            }
            this.textRight.text = Math.abs(numR);
        };

        // Setup the answer numbers and text
        Play.prototype.setupAnswer = function(answer) {
            // Negative numbers
            for (var i = 0; i < this.answerNumsNeg.length; i++) {
                if (-1 * i > answer) {
                    this.answerNumsNeg[i].display = true;
                }
                else {
                    this.answerNumsNeg[i].display = false;
                }
            }

            // Positive numbers
            for (i = 0; i < this.answerNums.length; i++) {
                if (i < answer) {
                    this.answerNums[i].display = true;
                }
                else {
                    this.answerNums[i].display = false;
                }
            }

            // Text answer
            this.textAnswer.text = answer;
        };

        // Go button click event
        Play.prototype.clickGo = function() {
            var me = this;
            return function(event) {
                /*var entity1 = me.entities[me.entities.length - 1];
                var entity2 = me.entities[me.entities.length - 2];
                entity1.componentAdd(new Tween(entity1, entity2.x, entity2.y, 10));
                entity2.componentAdd(new Tween(entity2, entity1.x, entity1.y, 10));*/
            };
        };

        // Menu button click event
        Play.prototype.clickMenu = function() {
            var me = this;
            return function(event) {
                me.engine.changeScenes("Menu");
            };
        };

        // Keyup event
        Play.prototype.keyup = function(event) {
            // If escape key, go to Menu scene
            if (event.keyCode === 27) {
                this.engine.changeScenes("Menu");
            }
        };

        // Count the numbers on the left side of the equation
        Play.prototype.getLeftCount = function(ctx) {
            var count = 0;
            var me = this;
            this.entities.forEach(function(entity) {
                if (entity.x < ctx.canvas.width / 3) {
                    if ("value" in entity) {
                        count += entity.value;
                    }
                }
            });

            return count;
        };

        // Count the numbers on the right side of the equation
        Play.prototype.getRightCount = function(ctx) {
            var count = 0;
            var me = this;
            this.entities.forEach(function(entity) {
                if ((entity.x > ctx.canvas.width / 3) && (entity.x < 2 * ctx.canvas.width / 3)) {
                    if ("value" in entity) {
                        count += entity.value;
                    }
                }
            });

            return count;
        };

        return Play;

    })();
});
