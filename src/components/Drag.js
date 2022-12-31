// MUI Resources
import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";

// Other Resources
import { useDrag, useDrop } from 'react-dnd'

/**
 * ## Generic Drop Location 
 * 
 * Remember to nest in a react-dnd drag provider
 * 
 * @param  {Map} props React props
 * - accept = {String, List} The types of droppables the bucket accepts
 * - drop = {Function} The drop callback 
 * - deps = {List} useDrop deps
 * - outlined = {Bool} Displays a highlight just on the left
 * - ariaRole = {String} The aria role of the bucket
 * 
 */
export function Bucket(props) {
    const theme = useTheme();
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
      // The type (or types) to accept - strings or symbols
      accept: props.accept,
      // Props to collect
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      }),
      drop: props.drop
    }), props.deps)

    const color = isOver ? theme.palette.warning.light : (canDrop ? theme.palette.success.main : theme.palette.background.default)
  
    return (
        <div
            ref={drop}
            role={props.ariaRole}
            style={{height: '100%'}}
        >
            <Box 
            height={'100%'} 
            style={{
                backgroundColor: props.outlined ? null : color,
                borderLeft: props.outlined ? `3px solid ${color}` : null,
                userSelect: 'none'
            }}
            >
                {props.children}
            </Box>
        </div>
    )
}

/**
 * ## Generic Drop Location 
 * 
 * Remember to nest in a react-dnd drag provider
 * 
 * @param  {Map} props React props
 * - type = {List} The type of the drop component
 * - id = {Bool} The id of the droppable component
 * - deps = {List} The deps of the component
 */
export function Drag(props) {
    const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
        // "type" is required. It is used by the "accept" specification of drop targets.
        type: props.type,
            // The collect function utilizes a "monitor" instance (see the Overview for what this is)
            // to pull important pieces of state from the DnD system.
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        item: { id: props.id },
    }), props.deps)
  
    return (
        <div ref={dragPreview} style={{ opacity: isDragging ? 0.5 : 1, height: '100%'}}>
            <div role="Handle" ref={drag} style={{padding: 1, height: '100%'}}>
                {props.children}
            </div>
        </div>
    )
}