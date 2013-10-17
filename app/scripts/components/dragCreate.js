/*
    Component: DragCreate
    On drag, creates a new draggable entity and drags it
    Ala getting something from a toolbar
*/
/*global define */
define(["jquery", "component"], function ($, Component) {
    "use strict";

    return (function() {
        // Inherit from the Component class
        Component.extend(DragCreate);

        // The name to refer to this component
        DragCreate.prototype.name = "DragCreate";

        // An entity to be created on drag, bound to its arguments
        // So could be passed as this for example: Entity.bind(this, 0, 0)
        DragCreate.prototype.EntityDragBind = null;

        function DragCreate(entity, EntityDragBind) {
            this.EntityDragBind = EntityDragBind;

            DragCreate.__super__.constructor.call(this, entity);
        }

        DragCreate.prototype.mousedown = function(event, engine) {
            var coords = engine.getEventCoords(event);

            // Check to see if the entity was clicked
            if (engine.isInside(coords, this.entity)) {
                // Create the new entity
                var dragging = engine.entityAdd(new this.EntityDragBind());
                dragging.components.Draggable.draggingX = coords.x - this.entity.x;
                dragging.components.Draggable.draggingY = coords.y - this.entity.y;
            }
        };

        return DragCreate;

    })();
});

