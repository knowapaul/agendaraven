// MUI Resources
import { VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { uTheme } from "../resources/Themes";

// Project Resources
import { SubNav } from "../items/SubNav";

/**
 * @param  {Map} props
 *
 * Props
 * - props.data -> List with the following layout:
 *
 * [{
 *      title: 'Title',
 *      subtitle: 'Subtitle',
 *      description: 'Description here',
 * },]
 *
 * - props.helperMessage -> Display this if there is no data available
 * - props.loading -> Whether form data is still loading
 * - props.open -> form open state
 * - props.setOpen -> form setOpen function
 * - props.back -> {handleBack, tooltip} (leave empty for no button)
 * - props.add -> {tooltip, text, restricted (organization), url? (instead of form)} (leave empty for no button)
 *
 */
export default function Cards(props) {
  return (
    <div>
      <div style={{ display: props.noHeader ? "none" : "initial" }}>
        <SubNav
          title={props.title}
          left={props.left}
          right={props.right}
        ></SubNav>
      </div>
      {props.loading ? (
        <Grid container padding={1} spacing={2} rowSpacing={0} sx={{ mt: 0 }}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={item}>
              <Skeleton
                variant="rounded"
                width="100%"
                height="200px"
                sx={{ backgroundColor: "grey.500" }}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container padding={1} spacing={2} rowSpacing={0} sx={{ mt: 0 }}>
          {props.data[0] ? (
            props.data.map((card) => (
              <Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={card.title}>
                <Paper
                  variant="outlined"
                  sx={{
                    py: 1,
                    px: 2,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "200px",
                  }}
                >
                  <Box flex={0}>
                    <Stack direction="row">
                      <VisibilityOff
                        fontSize="small"
                        sx={{
                          display:
                            card.published === false ? "initial" : "none",
                          my: "5px",
                          mr: 1,
                        }}
                      />
                      <Typography variant="h6" fontWeight={"bold"}>
                        {card.title}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Typography variant="body2">{card.subtitle}</Typography>
                  </Box>
                  <Typography
                    whiteSpace={"break-spaces"}
                    variant="body1"
                    mt={1}
                    flex={1}
                  >
                    {card.description}
                  </Typography>
                  <Box sx={{ flex: 0 }}>
                    <Box sx={{ float: "right" }}>
                      {props.icons ? <props.icons {...card} /> : ""}
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))
          ) : (
            <Typography
              padding={4}
              textAlign={"center"}
              color={uTheme.palette.text.secondary}
            >
              {props.helperMessage}
            </Typography>
          )}
        </Grid>
      )}
    </div>
  );
}
