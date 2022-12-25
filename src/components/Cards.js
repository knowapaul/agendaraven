import { ArrowBack, Add } from "@mui/icons-material"
import { Stack, Paper, Box, Typography, TextField, Avatar, Grid, Button, CircularProgress, Divider, useScrollTrigger } from "@mui/material"
import { useState } from "react";
import PopupForm from "./PopupForm";
import Form from "./Form";
import { NavButton, SubNav } from "./SubNav";
import Nav from "./Nav";

function AddButton(props) {
    return (
        <Box >
            <NavButton  
            title={props.tooltip}
            handleClick={() => {props.setOpen(true)}}
            >
                <Add sx={{mr: 1}} />
                <Typography
                noWrap
                >
                    {props.text}
                </Typography>
            </NavButton>

            <PopupForm open={props.open} setOpen={props.setOpen} title={props.formTitle} width={300}>
                {props.form}
            </PopupForm>
        </Box>
    )
}


/**
 * @param  {Map} props
 * 
 * Props
 * - props.data -> List with the following layout:
 * 
 * [{
 *      title: 'Title',
 *      subtitle: 'Subtitle',
 *      description: 'Description here',
 * },]
 * 
 * - props.helperMessage -> Display this if there is no data available
 * - props.form -> The form to add a card 
 * - props.formTitle -> The form's title
 * - props.loading -> Whether form data is still loading
 * - props.open -> form open state
 * - props.setOpen -> form setOpen function
 * - props.back -> {handleBack, tooltip} (leave empty for no button)
 * - props.add -> {tooltip, text} (leave empty for no button)
 * 
 */
export default function Cards(props) {
    return (
        <div>
            <SubNav 
            title={props.title}
            left={
                <div>
                    {props.back ? 
                    <NavButton
                    title={props.back.tooltip}
                    handleClick={props.back.handleBack}
                    >
                        <ArrowBack sx={{mr: 1}}/>
                        <Typography
                        noWrap
                        >
                            Back
                        </Typography>
                    </NavButton> : '' 
                    }
                </div>
            }
            right={
                <div>
                    {props.add ? 
                    <AddButton 
                    org={props.org} 
                    form={props.form} 
                    formTitle={props.formTitle} 
                    open={props.open}
                    setOpen={props.setOpen}
                    tooltip={props.add.tooltip}
                    text={props.add.text}
                    /> 
                    : ''
                    }
                </div>
            }
            >
            </SubNav>
            {
            props.loading ? <CircularProgress />
            :
            <Grid container 
            maxHeight={'calc(100vh - 64px - 52.5px)'} 
            overflow='scroll' 
            padding={1} 
            spacing={2} 
            rowSpacing={0}
            sx={{mt: 0}}
            >
                {props.data[0] ?
                props.data.map((card) => {
                    return (
                        <Grid item 
                        xs={12} sm={12} md={6} lg={4} xl={3}  
                        key={card.title}
                        >
                            <Paper 
                            variant="outlined"
                            sx={{
                                py: 1,
                                px: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: '200px'
                            }}
                            >
                                <Box flex={0}>
                                    <Typography
                                    variant='h6'
                                    fontWeight={'bold'}
                                    >
                                        {card.title}
                                    </Typography>
                                    <Divider />
                                    <Typography
                                    variant='body2'
                                    >
                                        {card.subtitle}
                                    </Typography>
                                </Box>
                                <Typography
                                variant='body1'
                                mt={1}
                                flex={1}
                                >
                                    {card.description}
                                </Typography>
                                <Box sx={{flex: 0}} >
                                    <Box sx={{float: 'right'}}>
                                        {props.icons}
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    )
                })       
                :
                <Typography padding={4} textAlign={'center'}>
                    {props.helperMessage}
                </Typography>   
            }
                
            </Grid>
            }
        </div>
    )
}