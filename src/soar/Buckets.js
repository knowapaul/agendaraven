// MUI Resources
import { Delete } from "@mui/icons-material";
import { Box } from "@mui/material";

// Project Resources
import { Drag, Bucket } from "../components/Drag";


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
                <Box >
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
    function handleDrop (item, monitor) {
        if (props.fields[0]) {
            let add = item.id;
            for (let i = 2; props.fields.includes(add); i++) {
                add = item.id + ' ' + i;
            }
            let fields = [...props.fields]
            fields.splice(props.index, 0, add)
            props.setFields(fields)
        } else {
            props.setFields([item.id])
        }
    }

    return (
      <Bucket
      accept={'fields'}
      drop={handleDrop}
      deps={[props.fields]}
      outlined={props.outlined}
      ariaRole={'Field Bucket'}
      >
        <Drag
        type={'movingField'}
        id={props.item}
        deps={[props.fields]}
        >
            {props.item}
            {props.children}
        </Drag>
      </Bucket>
    )
}