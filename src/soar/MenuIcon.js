// MUI Resources
import { Box, Button, Tooltip, Typography } from "@mui/material";

export function MenuIcon(props) {
  return (
    <Tooltip title={props.title}>
      <Button
        variant={props.selected ? "text" : "contained"}
        disableElevation
        onClick={props.handleClick}
        sx={{
          textTransform: "none",
          borderRadius: 0,
          height: "100%",
          width: props.width,
          padding: 1,
        }}
      >
        <Box minWidth="64px">
          {props.children}
          <Typography sx={{ fontSize: "12px" }} margin={0}>
            {props.title}
          </Typography>
        </Box>
      </Button>
    </Tooltip>
  );
}
