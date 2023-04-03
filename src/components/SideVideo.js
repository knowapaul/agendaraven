// MUI Resources
import { Paper, Grid } from "@mui/material";

export default function SideVideo(props) {
  return (
    <div>
      <Grid container spacing={2} alignItems="center">
        <Grid item sm={12} md={8}>
          <Paper elevation={6} sx={{ m: 3, padding: 3 }}>
            {props.children}
          </Paper>
        </Grid>
        <Grid item sm={12} md={4} display="flex" justifyContent="center">
          <iframe
            width="95%"
            style={{ aspectRatio: "16 / 9" }}
            src={props.videoURL}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Grid>
      </Grid>
    </div>
  );
}
