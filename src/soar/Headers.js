// React Resources
import { useState } from "react";

// MUI Resources
import {
  AutoAwesome,
  Check,
  Close,
  Public,
  Save,
  SettingsSuggest,
} from "@mui/icons-material";
import {
  Backdrop,
  Badge,
  Box,
  Button,
  ButtonGroup,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tooltip,
  Typography,
} from "@mui/material";

// Project Resources

// Other Resources

// MUI Resources
import {
  CalendarMonth,
  EventAvailable,
  Group,
  ImportantDevices,
} from "@mui/icons-material";

// Other Resources

function nameToURL(name) {
  return name.toLowerCase().split(" ").join("");
}

export function Bottom(props) {
  const [open, setOpen] = useState(false);

  const options = {
    Schedule: <CalendarMonth />,
    Forms: <EventAvailable />,
    Import: <ImportantDevices />,
    Availability: <Group />,
    Automation: <AutoAwesome />,
  };

  return (
    <Box>
      <Backdrop open={open} sx={{ display: { xs: "initial", md: "none" } }} />
      <SpeedDial
        ariaLabel="Tab Selection"
        direction="up"
        icon={<SpeedDialIcon />}
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClose={() => {
          setOpen(false);
        }}
        onOpen={() => {
          setOpen(true);
        }}
        open={open}
      >
        {Object.keys(options).map((opt) => (
          <SpeedDialAction
            key={opt}
            tooltipTitle={opt}
            tooltipOpen
            onClick={() => {
              props.setTab(nameToURL(opt));
              setOpen(false);
            }}
            selected={props.tab === nameToURL(opt)}
            icon={options[opt]}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}

/**
 * @param  {Map} props
 *
 * props.db
 */
export function Top(props) {
  //  COUNT?,outputLine,itemIndex;GREATER?,ans,1;MULTIPLY,ans,100;
  // COUNT?,outputs,itemIndex;EXP,ans,2
  // COUNT,outputLine,itemIndex;GREATER,ans,1;MULTIPLY,ans,100;
  // COUNT,outputs,itemIndex;EXP,ans,2

  // items: {'bob': [1, 2, 3], 'jeff': [4, 5, 6], 'steve': [5, 1, 2], 'chris': [1 ,5, 1]}
  const handleAutomate = () => {
    let tempFuncs = [...Object.values(props.funcs)];
    // Add exclamation points
    tempFuncs = tempFuncs.map((func) =>
      func
        .slice(0, -1)
        .concat([
          [func.slice(-1)[0][0] + "!"].concat(func.slice(-1)[0].slice(1)),
        ])
    );
    // Stringify
    tempFuncs = [].concat(...tempFuncs).join(";");

    const automateParams = {
      targets: "1,2,3",
      itemkeys: Object.values(props.people)
        .map((val) => val.schedulename)
        .join(","),
      itemvalues: "1,2,3;4,5,6;5,1,2;1,5,1",
      funcs: tempFuncs,
    };
    fetch("http://127.0.0.1:5000/schedule", {
      method: "POST",
      body: JSON.stringify(automateParams),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };
  return (
    <Box
      flex={0}
      display="flex"
      flexDirection={"row"}
      sx={{ height: "64px", width: "100%" }}
    >
      <ButtonGroup sx={{ margin: 1 }} variant="outlined">
        <Tooltip title={"Save (\u2318S)"}>
          <Button onClick={props.save} sx={{ textTransform: "none" }}>
            <Badge
              badgeContent={
                props.isSaved ? (
                  <Check fontSize="8px" />
                ) : (
                  <Close fontSize="8px" />
                )
              }
              color={props.isSaved ? "success" : "error"}
            >
              <Save />
            </Badge>
            <Typography
              sx={{ display: { xs: "none", sm: "initial" }, ml: 2 }}
              fontStyle={props.isSaved ? "initial" : "italic"}
            >
              {props.isSaved ? "Saved" : "Not Saved"}
            </Typography>
          </Button>
        </Tooltip>
        <Button
          onClick={() => {
            props.save("publish");
          }}
          sx={{ textTransform: "none" }}
        >
          <Public sx={{ mr: { xs: 0, sm: 1 } }} />
          <Typography sx={{ display: { xs: "none", sm: "initial" } }}>
            Publish
          </Typography>
        </Button>
        {props.tab === "schedule" ? (
          <Button onClick={handleAutomate} sx={{ textTransform: "none" }}>
            <SettingsSuggest sx={{ mr: { xs: 0, sm: 1 } }} />
            <Typography sx={{ display: { xs: "none", sm: "initial" } }}>
              Automate
            </Typography>
          </Button>
        ) : (
          ""
        )}
      </ButtonGroup>
    </Box>
  );
}
