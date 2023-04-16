// React Resources
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// MUI Resources
import { Button, Typography } from "@mui/material";

// Project Resources
import Form from "../common/items/Form";
import Nav from "../common/items/Nav";
import CenterForm from "../common/layouts/CenterForm";

// Firebase Resources
import { handleLogin } from "../common/resources/Firebase";

function SignIn(fields, setError) {
  handleLogin(fields.email, fields.password).catch((error) => {
    let message = error.message;

    if (
      message.includes("wrong-password") ||
      message.includes("user-not-found")
    ) {
      message = (
        <div>
          <strong>Incorrect credentials.</strong> Please double check your
          spelling. Passwords are case sensitive.
        </div>
      );
    }

    setError(message);
  });
}

export default function Login(props) {
  const [fields, setFields] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  return (
    <div>
      <Nav />
      <CenterForm>
        <Typography
          variant="h5"
          noWrap
          className="quicksand"
          textAlign="center"
        >
          Login
        </Typography>
        <Form
          inputs={[
            {
              title: "Email",
              type: "email",
              placeholder: "example@gmail.com",
              validate: "none",
              required: true,
            },
            {
              title: "Password",
              type: "password",
              placeholder: "",
              validate: "none",
              required: true,
            },
          ]}
          buttonText="Login and Continue"
          handleSubmit={(event) => {
            SignIn(fields, setError);
          }}
          data={fields}
          setData={setFields}
          formError={error}
        />
        <Button
          variant="contained"
          onClick={() => {
            navigate("/createaccount");
          }}
        >
          Create Account
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            navigate("/forgotpassword");
          }}
        >
          Forgot Password?
        </Button>
      </CenterForm>
    </div>
  );
}
