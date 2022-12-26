// React Resources
import { useState } from "react"

// MUI Resources
import { useTheme } from "@emotion/react";
import { Box, Grid, TextField, Typography } from "@mui/material";

// Project Resources
import { searchSort } from "../resources/SearchSort";


function Video(props) {
    return (
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
            <Box sx={{
            width: '100%',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            mb: 1,
            }} >
                <iframe 
                width="95%"
                className="video"
                src={props.url} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen 
                />
                <Typography
                variant="h6"
                >
                    {props.title}
                </Typography>
            </Box>
        </Grid>
    )
}


export default function OrgInsights(props) {
    const [ value, setValue ] = useState('');
    const [ videos ] = useState({
        'Random Words': 'https://www.youtube.com/embed/Ww_tuVeGmYU',
        'Are In': 'https://www.youtube.com/embed/Ww_tuVeGmYU',
        'This Search': 'https://www.youtube.com/embed/Ww_tuVeGmYU',
    })
    const theme = useTheme();

    const place = [
        "How to customize the home page ",
        "How to setup automatic scheduling",
        "How to send a chat message",
        "Productivity tips",
        "How to create a schedule"
        ][Math.floor(Math.random()*5)]
    

    return (
        <div>
            <TextField
            label='Search Videos'
            variant="outlined"
            value={value}
            placeholder={place}
            onChange={(event) => {setValue(event.target.value)}}
            sx={{ flex: 3, input: { color: theme.palette.text.secondary }, margin: 2, width: 280}}
            />
            <Grid container padding={2} width={'100%'}>
                {searchSort(value, Object.keys(videos)).map(key => (
                    <Video key={key} title={key} url={videos[key]} />
                ))}
            </Grid>
        </div>
    )
}