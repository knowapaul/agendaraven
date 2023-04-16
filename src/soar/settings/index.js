import { Button, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { uTheme } from "../../common/resources/Themes";

export default function SoarSettings(props) {
  const navigate = useNavigate();
  console.log("save", props.save);

  const wipeSchedule = () => {
    props.setFields([]);
    props.setItems([]);
  };

  return (
    <Box padding={2}>
      <Paper
        sx={{
          backgroundColor: uTheme.palette.error.light,
          padding: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4">Danger zone</Typography>
        <Typography sx={{ mt: 2 }}>
          Move this schedule to the archives
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            props.save("archive").then(() => {
              navigate(`/${props.org}/schedules`);
            });
          }}
        >
          Archive
        </Button>
        <Typography sx={{ mt: 2 }}>Permanently remove all columns</Typography>
        <Button variant="contained" onClick={wipeSchedule}>
          Wipe Schedule
        </Button>
      </Paper>
    </Box>
  );
}
