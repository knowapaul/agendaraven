import { Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { getAllAvs, getPeople } from "../resources/Firebase";

export default function PeopleAvs(props) {
    const [ people, setPeople ] = useState();
    const [ avs, setAvs ] = useState();

    useEffect(() => {
        getPeople(props.org, setPeople);
        getAllAvs(props.org, setAvs);
    }, [])

    console.log('rerender', avs)

    return (
        <Grid container width={'100%'} height={'100%'} overflow={'auto'}>
            {
                people ?
                Object.keys(people).sort().map(person => (
                    <Grid item sx={{padding: 1}} key={person} xs={12} sm={6} md={4} lg={3} >
                        <Paper variant={'outlined'} sx={{height: '100%'}}>
                            <Box padding={2}>
                                <Typography sx={{fontWeight: 'bold'}}>
                                    {person}
                                </Typography>
                                <Typography>
                                    {people[person].email}
                                </Typography>
                                {
                                    avs ?
                                    (
                                        avs[people[person].email]
                                        ?
                                        <Grid container>
                                            {avs[people[person].email][props.title]
                                            ?
                                            props.avFields.map((item) => (
                                                    <Grid item key={item.title} xs={6} sx={{padding: 1}}>
                                                        <Typography fontWeight={'bold'}>
                                                            {item.title}
                                                        </Typography>
                                                        <Typography>
                                                            {avs[people[person].email][props.title][item.title] || '---'}
                                                        </Typography>
                                                    </Grid>
                                                )
                                            )
                                            :
                                            ''
                                            }
                                        </Grid>
                                        :
                                        ''
                                    )
                                    :
                                    'not loaded yet'
                                }
                            </Box>
                        </Paper>
                    </Grid>
                ))
                :
                ''
            }
        </Grid>
    )
}