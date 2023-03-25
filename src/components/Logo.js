// React Resources
import { Link } from 'react-router-dom';

// MUI Resources
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// Project Resources
import uTheme from '../resources/Themes'

/**
 * ## Basic logo component for 
 */
export default function Logo(props) {    
        return (
            <Link to={props.href} style={{textDecoration: 'none'}}>
                <Stack
                direction="row"
                spacing={2} 
                margin={1}
                >
                    {props.logo}
                    <Typography
                    variant="h6"
                    noWrap
                    className='quicksand'
                    sx={{
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: uTheme.palette.text.secondary
                    }}
                    >
                        {props.title}
                    </Typography>
                </Stack>
            </Link>
        )
    }