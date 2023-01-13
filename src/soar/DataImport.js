import { useTheme } from "@emotion/react";
import { ArrowBack, Save } from "@mui/icons-material";
import { Paper, TextField, Box, Typography, Button } from "@mui/material";
import { useState } from "react";

export default function DataImport(props) {
    const theme = useTheme();
    const [ data, setData ] = useState('');
    const [ preview, setPreview ] = useState(false);

    return (
        <Box sx={{padding: 1, height: 'calc(100% - 16px)', overflow: 'auto'}}>
            {
                preview ?
                <Box>
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <Box sx={{flex: 1}}>
                            <Button variant='contained' onClick={() => {setPreview(false)}}>
                                <ArrowBack sx={{mr: 1}} />
                                Back
                            </Button>
                        </Box>
                        <Button variant='contained'>
                            <Save sx={{mr: 1}} />
                            Save
                        </Button>
                    </Box>
                    <table style={{borderCollapse: 'collapse'}}>
                        <thead>
                            <tr>
                                {
                                data.split('\n')[0].split('\t').map(item => (
                                    <td key={item} style={{padding: '3px'}}>
                                        <Typography sx={{fontWeight: 'bold'}}>
                                            {item}
                                        </Typography>
                                    </td>
                                ))
                                }   
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.split('\n').slice(1).map((row, rIndex) => (
                                    <tr key={rIndex}>
                                        {row.split('\t').map((item, iIndex) => (
                                            <td key={iIndex} style={{padding: '3px', border: `1px solid ${theme.palette.primary.main}`, }}>
                                                <Typography>
                                                    {item}
                                                </Typography>
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </Box>
                
                :
                <Paper sx={{ padding: 2, }} variant='outlined'>
                    <Box sx={{display: 'flex', flexDirection: 'row', padding: 1}}>
                        <Typography sx={{flex: 1}}>
                            Paste excel data below: 
                        </Typography>
                        <Button variant='contained' onClick={() => {setPreview(true)}}>
                            Preview and save
                        </Button>
                    </Box>
                    <TextField 
                    onChange={(e) => {setData(e.target.value)}}
                    value={data}
                    fullWidth
                    multiline
                    />
                </Paper>
            }
            
        </Box>
    )
}