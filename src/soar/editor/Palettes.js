// React Resources
import { useEffect, useState } from "react";

// MUI Resources
import { GridOn, Group, OtherHouses } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  Paper,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

// Project Resources
import { searchSort } from "../../resources/SearchSort";
import { DraggablePerson } from "./Objects";
import { Drag } from "./Objects";
import { uTheme } from "../../resources/Themes";

// Other Resources
import { Stack } from "@mui/system";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { getPeople } from "../../resources/Firebase";

function ItemsPalette(props) {
  const [people, setPeople] = useState({});

  useEffect(() => {
    getPeople(props.org, setPeople);
  }, [props.org]);

  return (
    <Grid container padding={2} width={"270px"} sx={{ margin: 0, padding: 0 }}>
      {searchSort(props.value, Object.keys(people)).map((key) => {
        // const firstName = key.split(' ')[0][0].toUpperCase() + key.split(' ')[0].slice(1).toLowerCase();
        return (
          <Grid key={key} item sx={{ margin: 1 }}>
            <DraggablePerson person={key} people={people} {...props} />
          </Grid>
        );
      })}
    </Grid>
  );
}

function OtherPalette(props) {
  const [on, setOn] = useState(false);

  return (
    <Box padding={1}>
      <Typography>{on ? "Value" : "Field"}</Typography>
      <Switch
        value={on}
        onChange={() => {
          setOn(!on);
        }}
      />
      <Drag
        id={props.value}
        type={on ? "person" : "fields"}
        deps={[props.value, on]}
      >
        <Paper>
          <Typography sx={{ padding: 1 }}>{props.value}</Typography>
        </Paper>
      </Drag>
    </Box>
  );
}

function FieldsPalette(props) {
  return (
    <Box padding={1}>
      <Grid container padding={1} spacing={1} width={"100%"}>
        {searchSort(props.value, props.dragItems).map((item) => (
          <Drag key={item} id={item} type={props.palette} deps={[props.fields]}>
            {item}
          </Drag>
        ))}
      </Grid>
    </Box>
  );
}

function Tabs(props) {
  const options = {
    Fields: <GridOn />,
    People: <Group />,
    Other: <OtherHouses />,
  };

  return (
    <Stack direction="row" spacing={"2px"}>
      {Object.entries(options).map((opt) => (
        <Button
          key={opt[0]}
          variant="contained"
          sx={{ padding: 0.5, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
          width={"100%"}
          onClick={() => {
            props.setPalette(opt[0].toLowerCase());
            props.setValue("");
          }}
          selected={props.palette === opt[0].toLowerCase()}
        >
          <Tooltip title={opt[0]}>
            <Stack direction={"row"}>
              {opt[1]}
              <Typography variant="subtitle2">{opt[0]}</Typography>
            </Stack>
          </Tooltip>
        </Button>
      ))}
    </Stack>
  );
}

export function Palette(props) {
  const [value, setValue] = useState("");

  const fieldItems = ["Time", "Place", "Day"];

  const palettes = {
    people: <ItemsPalette {...props} value={value} />,
    fields: (
      <FieldsPalette
        value={value}
        dragItems={fieldItems}
        palette={props.palette}
        fields={props.fields}
      />
    ),
    other: <OtherPalette value={value} />,
  };
  // const dragItems =  props.palette === 'people' ? peopleItems : fieldItems
  return (
    <Box flex={0}>
      <Box sx={{ width: { xs: 0, md: "270px" } }} />
      <Box
        sx={{
          display: { xs: "none", md: "initial" },
          width: "270px",
          position: "fixed",
          top: 64,
          left: 250,
          zIndex: 2400,
        }}
        borderRight={`1px solid ${uTheme.palette.primary.main}`}
        height={"calc(100vh - 64px)"}
      >
        <ErrorBoundary>
          <TextField
            sx={{ width: "100%", mb: "1px" }}
            variant="standard"
            value={value}
            placeholder={"Search"}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            inputProps={{ style: { color: uTheme.palette.primary.main } }}
          />
          <Tabs {...props} value={value} setValue={setValue} />

          {palettes[props.palette]}
        </ErrorBoundary>
        {props.selectTargets ? (
          <Button
            variant="contained"
            onClick={() => {
              props.setSelectTargets(false);
            }}
          >
            Done
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => {
              props.setSelectTargets(true);
            }}
          >
            Select Automation Targets
          </Button>
        )}
      </Box>
    </Box>
  );
}
