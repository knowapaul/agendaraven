// React Resources
import { useEffect, useState } from "react";

// MUI Resources
import { CircularProgress, Box, Typography, Paper } from "@mui/material";

// Project Resources
import { accessImage } from "../resources/Firebase";

/**
 * @param  {Map} props
 *
 * Displays loading and errors for an image loaded from firebase storage
 *
 * Passes all props to the image component to be loaded.
 * - source (image location in database)
 * - storage (firebase storage instance)
 * - alt
 * - height & width are preferred to set good dimensions
 * - *deps* = {List} Refresh when one of these changes
 * - refresh - bool
 */
export default function FriendlyLoad(props) {
  const [source, setSource] = useState();
  const [fail, setFail] = useState();

  const { refresh, setRefresh, ...imgProps } = props;

  useEffect(() => {
    accessImage(props.source, setSource, refresh);
    if (setRefresh) {
      setRefresh(false);
    }
  }, [refresh]);

  setTimeout(() => {
    setFail(true);
  }, 7000);

  return (
    <Box
      height={props.height}
      width={props.width}
      sx={{ aspectRatio: props.style ? props.style.aspectRatio : props.style }}
    >
      {source && source !== "ERROR" ? (
        <img {...imgProps} alt={props.alt} src={source} />
      ) : (source === "ERROR" || fail) && props.alt ? (
        props.alt
      ) : (
        <Paper
          variant="outlined"
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {source === "ERROR" || fail ? (
            <Typography sx={{ margin: "auto" }}>Error Loading Image</Typography>
          ) : (
            <CircularProgress color="secondary" />
          )}
        </Paper>
      )}
    </Box>
  );
}
