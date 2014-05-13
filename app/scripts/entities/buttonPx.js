/*
    Entity: Text: Button: ButtonPx
    Mathpx style button
*/
/*global define */
define(['jquery'], function ($) {
    'use strict';

    return (function() {
        hoopty.entities.Button.extend(ButtonPx);

        ButtonPx.prototype.width = 190;
        ButtonPx.prototype.height = 40;
        ButtonPx.prototype.padding = 16;
        ButtonPx.prototype.font = '20px \'Press Start 2P\'';
        ButtonPx.prototype.fillStyle = 'rgb(255, 255, 255)';
        ButtonPx.prototype.fillStyleButton = 'rgb(91, 131, 78)';
        ButtonPx.prototype.strokeStyle = 'rgb(255, 255, 255)';
        ButtonPx.prototype.qOffset = 4;
        ButtonPx.prototype.dOffset = 14;
        ButtonPx.prototype.pressOffset = 6;
        ButtonPx.prototype.clickDuration = 1;

        ButtonPx.prototype.clickedAgo = 0;
        ButtonPx.prototype.clickedStage = 0;
        ButtonPx.prototype.event = null;

        function ButtonPx(x, y, text, callback, width, height, fillStyle) {
            if (!width) {
                width = this.width;
            }
            if (!height) {
                height = this.height;
            }
            if (!fillStyle) {
                fillStyle = this.fillStyle;
            }

            ButtonPx.__super__.constructor.call(this, x, y, width, height, text, this.font, fillStyle, callback, this.padding, this.strokeStyle);
        }

        ButtonPx.prototype.render = function(ctx, dt) {
            // Just clicked, press
            if (this.clickedStage === 1) {
                this.clickedAgo += dt;
                this.y += this.pressOffset;
                this.dOffset -= this.pressOffset;
                this.clickedStage = 2;
            }
            // Keep pressed for half of duration
            else if (this.clickedStage === 2) {
                this.clickedAgo += dt;

                if (this.clickedAgo >= this.clickDuration / 2) {
                    this.clickedStage = 3;
                }
            }
            // Depress
            else if (this.clickedStage === 3) {
                this.clickedAgo += dt;
                this.y -= this.pressOffset;
                this.dOffset += this.pressOffset;

                if (this.clickedAgo >= this.clickDuration) {
                    this.clickedStage = 4;
                }
            }
            // Call callback and be done
            else if (this.clickedStage === 4) {
                this.callback(this.event);
            }

            // Draw the button
            this.drawButton(ctx);

            // Draw the text
            if (this.font !== null) {
                ctx.font = this.font;
            }
            ctx.fillStyle = this.fillStyle;
            ctx.fillText(this.text, this.x + this.padding, this.y + 2 * this.height / 3, this.width - this.padding * 2);
        };

        ButtonPx.prototype.drawButton = function(ctx) {
            // Draw the rectangle
            ctx.strokeStyle = this.strokeStyle;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.quadraticCurveTo(this.x + this.width / 2, this.y - this.qOffset, this.x + this.width, this.y);
            ctx.quadraticCurveTo(this.x + this.width + this.qOffset, this.y + this.height / 2, this.x + this.width, this.y + this.height);
            ctx.quadraticCurveTo(this.x + this.width / 2, this.y + this.height + this.qOffset, this.x, this.y + this.height);
            ctx.quadraticCurveTo(this.x - this.qOffset, this.y + this.height / 2, this.x, this.y);
            ctx.closePath();
            ctx.lineWidth = 5;
            ctx.stroke();
            ctx.fillStyle = this.fillStyleButton;
            ctx.fill();

            // Draw the shadow
            ctx.strokeStyle = this.strokeStyle;
            ctx.beginPath();
            ctx.moveTo(this.x + this.width, this.y);
            ctx.lineTo(this.x + this.width + this.dOffset, this.y + this.dOffset);
            ctx.quadraticCurveTo(this.x + this.width + 2 * this.dOffset / 3, this.y + this.height + this.dOffset / 2, this.x + this.width + this.dOffset, this.y + this.height + this.dOffset);
            ctx.quadraticCurveTo(this.x + this.dOffset / 2, this.y + this.height + this.dOffset / 2, this.x + this.dOffset, this.y + this.height + this.dOffset);
            ctx.lineTo(this.x, this.y + this.height);
            ctx.lineWidth = 3;
            ctx.stroke();
        };

        // ButtonPx click event, has to check if click was inside the button!
        ButtonPx.prototype.click = function(event, scene) {
            if (hoopty.scenes.Scene.isInside(scene.getEventCoords(event), this) && this.display) {
                this.event = event;
                this.clickedStage = 1;
            }
        };

        return ButtonPx;

    })();
});
