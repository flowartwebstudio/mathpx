/*
    Entity: NumberPos
    A positive number
*/
/*global define */
define(["jquery", "extendable", "entity", "sprite", "draggable", "dragCreate", "bounded"], function ($, Extendable, Entity, Sprite, Draggable, DragCreate, Bounded) {
    "use strict";

    return (function() {
        // Inherit from the Extendable class
        Sprite.extend(Num);

        Num.prototype.width = 64;
        Num.prototype.height = 64;

        // Sprite
        Num.prototype.spriteSheet = $("img.gettable.gettable-math").attr("src");
        Num.prototype.spriteWidth = 16;
        Num.prototype.spriteHeight = 16;
        Num.prototype.spriteX = 0;
        Num.prototype.spriteY = 0;
        Num.prototype.spriteXDefault = 0;
        Num.prototype.spriteYDefault = 0;

        Num.prototype.value = 1;

        function Num(x, y, toolbar) {
            Num.__super__.constructor.call(this, x, y, this.width, this.height, this.spriteSheet, this.spriteX, this.spriteY, this.spriteWidth, this.spriteHeight);

            // Add the bounded component
            this.componentAdd(new Bounded(this));

            // Set up a normal number
            if (!toolbar) {
                // Add an animation and start it
                this.spriteAnimationAdd("rest", 0, 0, 3, 0.15);
                this.spriteAnimate("rest");

                // Add the draggable component
                this.componentAdd(new Draggable(this));
            }
            // Otherwise setup a toolbar number
            else {
                this.componentAdd(new DragCreate(this, Num));
            }
        }

        return Num;

    })();
});
