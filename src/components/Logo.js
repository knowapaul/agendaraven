// React Resources
import { Link } from 'react-router-dom';

// MUI Resources
import { useTheme } from '@emotion/react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// Project Resources

/**
 * ## Basic logo component for 
 */
export default function Logo(props) {
    const theme = useTheme();
  
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
          sx={{
          fontFamily: 'quicksand',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: theme.palette.text.secondary
          }}
          >
            {props.title}
          </Typography>
        </Stack>
      </Link>
    )
  }