// React Resources
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// MUI Resources
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Card,
  CardContent,
  Fab,
  Grid,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";

// Project Resources
import CreateOrJoin from "../home/CreateOrJoin";
import FriendlyLoad from "../common/load/FriendlyLoad";
import { getUserData } from "../common/resources/Firebase";
import { uTheme } from "../common/resources/Themes";

function OrgCard(props) {
  return (
    <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
      <Link to={`../${props.text}/home`} style={{ textDecoration: "none" }}>
        <Card>
          <CardContent sx={{ padding: 1 }} color="primary">
            <Typography variant="h6">{props.text}</Typography>
            {
              <FriendlyLoad
                source={props.text + "/index/image.jpg"}
                width={"100%"}
                style={{
                  objectFit: "cover",
                  borderRadius: uTheme.shape.borderRadius,
                  aspectRatio: "16 / 9",
                }}
                alt={
                  <img
                    alt="Default organization"
                    src="/ubdfallback.png"
                    width="100%"
                    height="100%"
                  />
                }
              />
            }
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}

function Add() {
  const [open, setOpen] = useState(false);

  return (
    <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
      <Box
        width="100%"
        sx={{
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: uTheme.shape.borderRadius,
        }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Fab
          variant="extended"
          color="secondary"
          aria-label="add"
          sx={{ mt: 3 }}
          onClick={() => {
            setOpen(true);
          }}
        >
          <AddIcon />
          <Typography ml={1}>Create or Join</Typography>
        </Fab>

        <CreateOrJoin open={open} setOpen={setOpen} />
      </Box>
    </Grid>
  );
}

export default function Organizations(props) {
  const [orgs, setOrgs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getUserData()
      .then((data) => {
        setOrgs(data.orgs);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return (
    <Box padding={2}>
      {error ? (
        <Typography>
          An error has occurred. Please refresh the page and try again.
        </Typography>
      ) : loading ? (
        <Grid container spacing={2}>
          {[1, 2, 3].map((key) => (
            <Grid item key={key} xs={12} sm={6} md={6} lg={4} xl={3}>
              <Skeleton
                variant="rounded"
                width="100%"
                height="100%"
                sx={{ backgroundColor: "grey.400" }}
              >
                <Paper sx={{ padding: 1 }} color="primary">
                  <Typography variant="h6">Text</Typography>
                  <img
                    src="/ubdfallback.png"
                    alt="Default organization"
                    width="100%"
                    height="100%"
                    style={{ aspectRatio: "16 / 9" }}
                  />
                </Paper>
              </Skeleton>
            </Grid>
          ))}
          <Add />
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {Object.keys(orgs).map((text) => {
            return <OrgCard key={text} text={text} />;
          })}
          <Add />
        </Grid>
      )}
    </Box>
  );
}
