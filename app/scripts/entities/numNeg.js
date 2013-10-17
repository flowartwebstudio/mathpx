/*
    Entity: Num: NumNeg
    A negative number
*/
/*global define */
define(["jquery", "sprite", "draggable", "dragCreate", "bounded"], function ($, Sprite, Draggable, DragCreate, Bounded) {
    "use strict";

    return (function() {
        Sprite.extend(NumNeg);

        NumNeg.prototype.width = 64;
        NumNeg.prototype.height = 64;

        // Sprite
        NumNeg.prototype.spriteSheet = $("img.gettable.gettable-math").attr("src");
        NumNeg.prototype.spriteWidth = 16;
        NumNeg.prototype.spriteHeight = 16;
        NumNeg.prototype.spriteX = 0;
        NumNeg.prototype.spriteY = 1;
        NumNeg.prototype.spriteXDefault = 0;
        NumNeg.prototype.spriteYDefault = 1;

        NumNeg.prototype.value = -1;

        function NumNeg(x, y, boundedWidth, boundedHeight, toolbar, active) {
            NumNeg.__super__.constructor.call(this, x, y, this.width, this.height, this.spriteSheet, this.spriteX, this.spriteY, this.spriteWidth, this.spriteHeight);

            // Add the bounded component
            this.componentAdd(new Bounded(this, 0, 0, boundedWidth, boundedHeight));

            if (active) {
                // Add an animation and start it
                this.spriteAnimationAdd("rest", 0, 1, 3, 0.15);
                this.spriteAnimate("rest");

                // Add the draggable component
                this.componentAdd(new Draggable(this));
            }

            if (toolbar) {
                // Add the dragCreate component
                this.componentAdd(new DragCreate(this, NumNeg.bind(this, this.x, this.y, boundedWidth, boundedHeight, false, true)));
            }
        }

        return NumNeg;

    })();
});

