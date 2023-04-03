import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";

export default function SoarSettings(props) {
  const navigate = useNavigate();
  console.log("save", props.save);
  return (
    <Box padding={2}>
      <Typography>Move this schedule to the archives</Typography>
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
    </Box>
  );
}
