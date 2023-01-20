// MUI Resources
import { DeleteForeverOutlined, PunchClock } from "@mui/icons-material";
import { Backdrop, Box, Button, Menu, MenuItem, Paper, TextField, Tooltip, Typography } from "@mui/material";
import { useState } from "react";

// Project Resources

// MUI Resources
import { ThemeProvider, useTheme } from "@emotion/react";

// Other Resources
import { useDrag, useDrop } from 'react-dnd';
import { getPeopleHighlight } from "./Highlight";
import { bTheme, mTheme, oTheme, wTheme } from "../../resources/Themes";


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
 * - highlight = {Color} The color of the bucket when a droppable item is grabbed
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

    const highlight = props.highlight ? props.highlight : 'green'

    const color = isOver ? theme.palette.warning.light : (canDrop ? highlight : theme.palette.background.default)
  
    return (
        <Box 
        ref={drop}
        role={props.ariaRole}
        height={'100%'} 
        style={{
            backgroundColor: props.outlined ? null : color,
            borderRight: props.outlined ? `3px solid ${color}` : null,
            userSelect: 'none'
        }}
        >
            {props.children}
        </Box>
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
            <div role="Handle" ref={drag} style={{padding: 1, height: '100%'}} onMouseOver={props.handleClick}>
                {props.children}
            </div>
        </div>
    )
}

/**
 * @param  {Map} props React Props
 * 
 * - index = {}
 * - parent = {String} The id of the parent
 * - item = {String} The item being 
 * 
 */
export function PersonBucket(props) {
    function handleDrop (item, monitor) {
        let items = [...props.items];
        if (!props.items[props.index]) {
            items = items.concat({});
        }
        items[props.index][props.parent] = item.id;
        props.setItems(items);
    }

    return (
        <Box sx={{height: '100%'}}>  
            <Bucket
            accept={'person'}
            drop={handleDrop}
            deps={[props.items, props.highlight]}
            ariaRole={'Person Bucket'}
            highlight={props.highlight ? props.highlight[props.index] : undefined}
            >
                <Box sx={{height: '100%', minHeight: '24px'}} />
            </Bucket>
        </Box>
    )
}

export function FieldBucket(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [ formOpen, setFormOpen ] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function handleDrop (item, monitor) {
        if (props.fields[0]) {
            let add = item.id;
            for (let i = 2; props.fields.includes(add); i++) {
                add = item.id + ' ' + i;
            }
            let fields = [...props.fields]
            fields.splice(props.index + 1, 0, add)
            props.setFields(fields)
        } else {
            props.setFields([item.id])
        }
    }

    function handleDelete() {
        let out = [...props.fields];
        out.splice(props.index, 1)
        props.setFields(out)
        handleClose()
    }

    function handleCat(type) {
        props.setCats(Object.assign(props.cats || {}, {[props.item]: type}))
    }

    function convertTimesTo(meridian) {
        const newFields = props.items.map((row) => {
            let out = row;
            let t = row['Time'].split(':')
            if (t[0] < 12) {
                t[0] = meridian === 'PM' ?  Number(t[0]) + 12 : t[0] 
            } else {
                t[0] = meridian === 'AM' ?  Number(t[0]) - 12 : t[0] 
            }
            out['Time'] = t.join(':');
            return out;
        })
        props.setItems(newFields)
    }

    return (
      <Bucket
      accept={'fields'}
      drop={handleDrop}
      deps={[props.fields]}
      outlined={props.outlined}
      ariaRole={'Field Bucket'}
      >
        <Box 
        fontWeight={'bold'}
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{mr: '2px'}}
        >
            <Typography 
            variant='subtitle2'
            fontWeight='bold'
            >
                {props.item}
            </Typography>
            {props.children}
        </Box>
        <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        >
            {props.item ? 
            <Typography variant="subtitle1" fontWeight={'bold'} textTransform='capitalize' sx={{mx: 2}}>{'Column "' + props.item + '"'}</Typography>
            :
            ''
            }
            <MenuItem onClick={handleDelete}><DeleteForeverOutlined sx={{mr: 1, ml: 0}}/> Delete</MenuItem>
            <MenuItem onClick={() => {setFormOpen(true); handleClose()}}><DeleteForeverOutlined sx={{mr: 1, ml: 0}}/> Type: {props.cats && props.item ? props.cats[props.item] : 'NONE'}</MenuItem>
            {props.cats && props.item ? 
                props.cats[props.item] === 'time' ?
                [
                    <MenuItem key={'AM'} onClick={() => {convertTimesTo('AM')}}><PunchClock sx={{mr: 1, ml: 0}}/> Set all to AM</MenuItem>,
                    <MenuItem key={'PM'} onClick={() => {convertTimesTo('PM')}}><PunchClock sx={{mr: 1, ml: 0}}/> Set all to PM</MenuItem>
                ]
                :
                ''
                :
                ''
            }
        </Menu>
        <Backdrop 
        open={formOpen}
        onClick={() => {setFormOpen(false)}}
        >
            <ThemeProvider theme={mTheme}>
                <Paper sx={{padding: 5}}>
                    <Typography sx={{mb: 5}} variant='h4'>
                        Select type
                    </Typography>
                    <Button sx={{margin: 1}} variant='contained' onClick={() => {handleCat('time')}}>
                        Time
                    </Button>
                    <Button sx={{margin: 1}} variant='contained' onClick={() => {handleCat('person')}}>
                        Person
                    </Button>
                    <Button sx={{margin: 1}} variant='contained' onClick={() => {handleCat('NONE')}}>
                        NONE
                    </Button>
                </Paper>
            </ThemeProvider>
        </Backdrop>
      </Bucket>
    )
}

export function DisplayItem(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleDelete = () => {
        let adapted = [...props.items];
        delete adapted[props.index][props.field];
        props.setItems(adapted)
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    let displayText = props.row[props.field];
    if (props.cats) {
        if (props.cats[props.field] === 'person') {
            try {
                displayText = props.people[props.row[props.field]].schedulename;
            } catch (typeError) {
                console.log(typeError.message)
            }
        } else if (props.cats[props.field] === 'time') {
            let iDate = new Date();
            let text = props.row[props.field].split(':');
            iDate.setHours(text[0], text[1], 0, 0)
            let out = iDate.toLocaleString('en-US', {timeStyle: 'short'});
            displayText = isNaN(iDate.getTime()) ? props.cats[props.field] : out
        }
    }

    return (
        <div>
            <Typography
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{textTransform: 'none', margin: 'auto'}}
            >
                {displayText}
            </Typography>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
            >
                <Typography variant="subtitle1" fontWeight={'bold'} sx={{mx: 2}}>{'Item "' + displayText + '"'}</Typography>
                <MenuItem onClick={handleDelete} sx={{minWidth: '100px'}}><DeleteForeverOutlined sx={{mr: 1, ml: 0}}/> Delete</MenuItem>
            </Menu>
        </div>
    )
}

/**
 * ## Create a draggable person component
 * 
 * @param  {Map} props React Props
 * 
 * - person (key)
 * - people
 * 
 */
export function DraggablePerson(props) {
    function onDrag() {
        props.setHighlight(getPeopleHighlight(props.people[props.person].email, props))
    }

    let personAv;
    try {
        personAv = props.avs[props.people[props.person].email][props.title]

    } catch (error) {
        console.log(error.message)
    }

    if (!personAv) {personAv = {}}

    return (
        <Drag type="person" id={props.person} handleClick={onDrag}>
            <Tooltip title={Object.entries(personAv).map((i) => (i.join(': '))).join(', \n')}>
                <Typography 
                variant='body1'
                >
                    {props.people[props.person].schedulename}
                </Typography>
            </Tooltip>
        </Drag>
    )
}