import { Box, Button, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CustomSnackbar } from "../common/CustomSnackbar";
import {
  getFirebase,
  getUserData,
  handleUpdatePassword,
} from "../common/resources/Firebase";

export default function Account(props) {
  const [changing, setChanging] = useState(false);
  const [name, setName] = useState("");
  const [old, setOld] = useState("");
  const [pass, setPass] = useState("");
  const [conf, setConf] = useState("");
  const [sch, setSch] = useState("");

  const [cPass, setCPass] = useState(false);
  const [cConf, setCConf] = useState(false);

  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState();

  useEffect(() => {
    getUserData().then((data) => {
      setSch(data.info.schedulename);
    });
    setName(getFirebase().auth.currentUser.displayName);
  }, []);

  function handleChangePassword() {
    if (pass === conf && pass.length > 8) {
      handleUpdatePassword(pass)
        .then(() => {
          setMessage("Password successfully changed");
          setSeverity("success");
        })
        .catch((e) => {
          setMessage(e.error);
          setSeverity("error");
        });
    } else {
    }
  }

  return (
    <Box
      height={{ xs: "calc(100% - 56px)", md: "calc(100% - 64px)" }}
      overflow="auto"
    >
      <Button
        onClick={() => {
          setChanging(!changing);
        }}
        variant="contained"
        sx={{ margin: 2 }}
      >
        Edit
      </Button>
      <Tooltip title={changing ? "" : "Click 'Edit' to make modfications"}>
        <Box
          padding={2}
          sx={{ backgroundColor: changing ? "" : "rgba(0, 0, 0, .25)" }}
        >
          <Typography variant="h5" sx={{ pb: 2 }}>
            Full Name
          </Typography>
          <TextField
            value={name}
            label={"Name"}
            onChange={(e) => {
              setName(e.target.value);
            }}
            disabled={!changing}
            sx={{ display: "block", mb: 2 }}
            variant="outlined"
          />
          <Button variant="contained" disabled={!changing}>
            Set Full Name
          </Button>
          <Typography variant="h5" sx={{ pt: 2, pb: 1 }}>
            Default Schedule Name
          </Typography>
          <Typography variant="subtitle2" sx={{ pb: 2 }}>
            This will not change past organization's schedule names. You can do
            that in the organization's settings tab.
          </Typography>
          <TextField
            value={sch}
            label={"Schedule Name"}
            onChange={(e) => {
              setSch(e.target.value);
            }}
            disabled={!changing}
            sx={{ display: "block", mb: 2 }}
          />
          <Button variant="contained" disabled={!changing}>
            Set Schedule Name
          </Button>
          <Typography variant="h5" sx={{ py: 2 }}>
            Change Password:
          </Typography>
          <TextField
            value={old}
            label={"Old Password"}
            onChange={(e) => {
              setOld(e.target.value);
            }}
            sx={{ display: "block", mt: 1, mb: 2 }}
            disabled={!changing}
            type="password"
          />
          <TextField
            value={pass}
            label={"New Password"}
            onChange={(e) => {
              setPass(e.target.value);
            }}
            sx={{ display: "block" }}
            disabled={!changing}
            error={cPass && pass.length < 9}
            helperText={
              cPass && pass.length < 9
                ? "Passwords must be longer than 8 characters"
                : ""
            }
            onBlur={() => {
              setCPass(true);
            }}
            type="password"
          />
          <TextField
            value={conf}
            label={"Confirm New Password"}
            onChange={(e) => {
              setConf(e.target.value);
            }}
            sx={{ display: "block", mt: 1, mb: 2 }}
            disabled={!changing}
            error={cConf && pass !== conf}
            helperText={
              cConf && pass !== conf ? "Passwords must be identical" : ""
            }
            onBlur={() => {
              setCConf(true);
            }}
            type="password"
          />
          <Button
            variant="contained"
            disabled={!changing}
            onClick={handleChangePassword}
          >
            Set New Password
          </Button>
        </Box>
      </Tooltip>
      <CustomSnackbar
        text={message}
        open={!!message}
        setOpen={setMessage}
        severity={severity}
      />
    </Box>
  );
}
