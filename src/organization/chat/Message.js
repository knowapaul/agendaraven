// MUI Resources
import { Paper, Box } from "@mui/material";

export default function Message(props) {
  const b = props.side === "right";
  const l = b ? "" : 0;
  const r = b ? 0 : "";

  return (
    <Box sx={{ display: "flex", justifyContent: props.side }}>
      <Paper
        variant="outlined"
        className="chatMessage"
        sx={{
          margin: 1,
          pt: 0.5,
          pb: 0.5,
          pl: 1.5,
          pr: 1.5,
          borderRadius: 4,
          borderBottomLeftRadius: l,
          borderBottomRightRadius: r,
          maxWidth: "50%",
          minHeight: "32px",
        }}
      >
        {props.body}
      </Paper>
    </Box>
  );
}
