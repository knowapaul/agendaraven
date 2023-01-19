// MUI Resources
import { Delete, DeleteForeverOutlined } from "@mui/icons-material";
import { Box, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";

// Project Resources
import { Bucket } from "../components/Drag";


export function DeleteBucket(props) {
    function handleDrop(item, monitor) {
        let fields = [...props.fields]
        const i = fields.indexOf(item.id);
        if (i !== -1) {
            fields.splice(i, 1)
        }
        props.setFields(fields)
    }
    return (
        <Bucket
        accept={['movingField', 'movingPerson']}
        drop={handleDrop}
        deps={[props.fields]}
        >
            <Delete sx={{my: 2, mx: 7}} />
        </Bucket>
    )
}

/**
 * @param  {Map} props React Props
 * 
 * - items = {Arrary} An array of objects
 * - index = {}
 * - parent = {String} The id of the parent
 * - item = {String} The item being 
 * - items = {Array} 
 * - setItems = {Function}
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
            deps={[props.items]}
            ariaRole={'Person Bucket'}
            >
                <Box sx={{height: '100%', minHeight: '24px'}}>
                    {
                    props.item 
                    ?
                    props.item
                    :
                    props.children
                    }
                </Box>
            </Bucket>
        </Box>
    )
}

export function FieldBucket(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
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
        </Menu>
      </Bucket>
    )
}