import { Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { getAllAvs, getPeople } from "../resources/Firebase"

export default function PeopleAvs(props) {
    const [ people, setPeople ] = useState();
    const [ avs, setAvs ] = useState();

    useEffect(() => {
        getPeople(props.org, setPeople);
        getAllAvs(props.org, setAvs);
    }, [])

    console.log(avs)

    return (
        <Grid container>
            {
                people ?
                Object.keys(people).map(person => (
                    <Grid item sx={{margin: 1}} key={person}>
                        <Paper variant={'outlined'} sx={{padding: 2}}>
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
                                    <Box>
                                        {avs[people[person].email][props.title]
                                        ?
                                        Object.keys(avs[people[person].email][props.title]).map((item) => (
                                            <Box key={item}>
                                                <Typography fontWeight={'bold'}>
                                                    {item}
                                                </Typography>
                                                <Typography>
                                                    {avs[people[person].email][props.title][item]}
                                                </Typography>
                                            </Box>
                                        ))
                                        :
                                        ''
                                        }
                                    </Box>
                                    :
                                    ''
                                )
                                :
                                ''
                            }
                        </Paper>
                    </Grid>
                ))
                :
                ''
            }
        </Grid>
    )
}