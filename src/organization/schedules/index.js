// React Resources
import { useEffect, useState } from "react";

// MUI Resources
import { Archive, Edit, Visibility } from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";

// Project Resources
import { useNavigate } from "react-router-dom";
import AddButton from "../../common/items/AddButton";
import AdminCheck from "../../account/AdminCheck";
import Cards from "../../common/layouts/Cards";
import { ErrorBoundary } from "../../common/errors/ErrorBoundary";
import Form from "../../common/items/Form";
import { NavButton } from "../../common/items/SubNav";
import {
  getAllSchedules,
  internalCheckAdmin,
  saveSchedule,
} from "../../common/resources/Firebase";

// Options for the View component
function Icons(props) {
  const navigate = useNavigate();
  return (
    <Box display={"flex"} flexDirection={"row"}>
      <Tooltip
        title={"View Schedule"}
        sx={{ display: props.published ? "initial" : "none" }}
      >
        <IconButton
          color="secondary"
          onClick={() => {
            navigate(`/${props.org}/schedules/${props.title}`);
          }}
          sx={{ width: "36px", height: "36px" }}
        >
          <Visibility />
        </IconButton>
      </Tooltip>

      <AdminCheck org={props.org}>
        <Tooltip title={"Edit Schedule"}>
          <IconButton
            color="secondary"
            onClick={() => {
              navigate(`/soar/${props.org}/${props.title}/schedule`);
            }}
            sx={{ width: "36px", height: "36px" }}
          >
            <Edit />
          </IconButton>
        </Tooltip>
      </AdminCheck>
    </Box>
  );
}

// View posted schedules
function View(props) {
  const [data, setData] = useState({ schedulename: "", scheduletype: "" });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState();
  const [display, setDisplay] = useState();
  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState(true);
  const navigate = useNavigate();

  function handleSubmit() {
    saveSchedule(props.org, data.schedulename, {
      type: data.scheduletype,
      contents: [],
      fields: [],
      timestamp: new Date().toString(),
    })
      .then(() => {
        console.log("sucess!");
        navigate(`/soar/${props.org}/${data.schedulename}/schedule`);
      })
      .catch((e) => {
        console.log(e);
        setError(e.message);
      });
  }

  useEffect(() => {
    let displayDat = [];
    internalCheckAdmin(props.org).then((isAdmin) => {
      props.data.forEach((item) => {
        console.log("item", item, isAdmin);
        if (item.published || isAdmin) {
          displayDat = displayDat.concat(item);
        }
      });
      setHeader(!isAdmin);
      setDisplay(displayDat);
      setLoading(false);
    });
  }, [props.data, props.org]);

  return (
    <div>
      <Cards
        data={display}
        loading={loading}
        open={true}
        noHeader={header}
        setOpen={() => {}}
        helperMessage={
          "There are currently no schedules to display. If that doesn't seem right, try refreshing the page."
        }
        icons={Icons}
        left={
          <AdminCheck org={props.org}>
            <NavButton
              title="View Archived Schedules"
              handleClick={() => {
                navigate(`/${props.org}/archives`);
              }}
            >
              <Archive sx={{ mr: 1 }} />
              <Typography>Archives</Typography>
            </NavButton>
          </AdminCheck>
        }
        right={
          <AdminCheck org={props.org}>
            <AddButton
              open={open}
              setOpen={setOpen}
              text="New Schedule"
              tooltip="Create a schedule"
              formTitle="Create a schedule"
              form={
                <Form
                  inputs={[
                    {
                      title: "Schedule Name",
                      placeholder: "Case sensitive",
                      type: "text",
                      required: true,
                      validate: "document",
                    },
                    {
                      title: "Schedule Type",
                      placeholder: "Describe your schedule",
                      type: "text",
                      required: true,
                      validate: "text",
                    },
                  ]}
                  data={data}
                  setData={setData}
                  buttonText={"Go to SOAR"}
                  handleSubmit={handleSubmit}
                  formError=""
                />
              }
              formError={error}
            />
          </AdminCheck>
        }
      />
    </div>
  );
}

// Main export
export default function Schedules(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getAllSchedules(props.org, setData);
  }, [props.org]);

  return (
    <ErrorBoundary>
      <View {...props} data={data} />
    </ErrorBoundary>
  );
}
