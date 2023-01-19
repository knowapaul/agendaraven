// MUI Resources
import { DeleteForeverOutlined, DragHandle } from "@mui/icons-material";
import { Box, Menu, MenuItem, Typography } from "@mui/material";

// Project Resources

// Other Resources
import { useState } from "react";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { FieldBucket, PersonBucket } from './Buckets';
import { Palette } from "./Palettes";


function Item(props) {
    const handleDelete = () => {
        let adapted = [...props.items];
        delete adapted[props.index][props.field];
        props.setItems(adapted)
    }


    const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
        {props.row[props.field]}
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
        <Typography variant="subtitle1" fontWeight={'bold'} sx={{mx: 2}}>{'Item "' + props.row[props.field] + '"'}</Typography>
        <MenuItem onClick={handleDelete} sx={{minWidth: '100px'}}><DeleteForeverOutlined sx={{mr: 1, ml: 0}}/> Delete</MenuItem>
      </Menu>
    </div>
  )
}

function RowHandle(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function handleDelete() {
        let out = [...props.items];
        out.splice(props.index, 1)
        props.setItems(out)
        handleClose()
    }

    return (
        <div>
            <Box onClick={handleClick}><DragHandle sx={{transform: 'rotate(90deg)'}} /></Box>
            <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
            >
                <Typography variant="subtitle1" fontWeight={'bold'} sx={{mx: 2}}>{'Row ' + props.index}</Typography>
                <MenuItem onClick={handleDelete}><DeleteForeverOutlined sx={{mr: 1, ml: 0}}/> Delete</MenuItem>
            </Menu>
        </div>
    )
}

function DisplaySchedule(props) {
    
    return (
        
        <Box display={'flex'} flexDirection={'row'} height={'100%'} width={'100%'}  overflow={'auto'}>
            {
                props.fields[0]
                ?
                <table style={{borderCollapse: 'collapse', marginTop: '4px', marginBottom: '16px'}} >
                    <thead>
                        <tr>
                            <th>
                                <FieldBucket index={-1} fields={props.fields} setFields={props.setFields} ><Box width='100%' height={'100%'} >-</Box></FieldBucket>
                            </th>
                            {props.fields.map((field, oIndex) => (
                                <th key={field}>
                                    <FieldBucket 
                                    item={field}
                                    fields={props.fields} 
                                    setFields={props.setFields} 
                                    index={oIndex}
                                    outlined
                                    />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {props.items[0]
                            ?
                            props.items.map((row, iIndex) => (
                                <tr key={'row' + iIndex}>
                                    <td>
                                        <RowHandle index={iIndex} {...props} />
                                    </td>
                                    {props.fields.map((field, fIndex) => (
                                        <td key={field} style={{border: '1px solid black', padding: 2 }}>
                                            {row[field]
                                            ?
                                            <Item {...props} row={row} index={iIndex} field={field}/>
                                            :
                                            <PersonBucket 
                                            item={row[field]}
                                            items={props.items} 
                                            setItems={props.setItems} 
                                            index={iIndex}
                                            parent={field}
                                            />
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))
                            :
                            ''
                        }
                        <tr>
                            <td />
                            {props.fields.map((field, fIndex) => (
                                <td key={fIndex} style={{border: '1px dotted grey', margin: 1}}>
                                    <PersonBucket
                                    key={props.items.length} 
                                    index={props.items.length}
                                    parent={field}
                                    item={props.items[props.items.length]}
                                    items={props.items} 
                                    setItems={props.setItems} 
                                    />
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
                :
                <FieldBucket index={0} fields={props.fields} setFields={props.setFields} >
                    <Typography sx={{padding: 2}}>
                        Drag a field here to begin
                    </Typography>
                </FieldBucket>
            }
            
        </Box>
        
    )
}

export function Schedule(props) {
    return (
        <ErrorBoundary>
            <Box display={'flex'} flexDirection='row' height={'100%'} width={'100%'}>
                <DisplaySchedule {...props}/>
                <Palette {...props}/>
            </Box>
        </ErrorBoundary>
    )
}