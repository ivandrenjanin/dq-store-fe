import { AxiosInstance } from "axios";
import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import StoreIcon from "@material-ui/icons/Store";

import { login } from "../../api";
import { validateEmail } from "../../helpers/validate-email";

interface IProps {
  apiClient: AxiosInstance;
}

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "center",
    marginTop: 75,
  },
  signInForm: {
    width: "45%",
  },
}));

export const SignIn = ({ apiClient }: IProps) => {
  const classes = useStyles();
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.elements[0] as HTMLInputElement;
    const password = e.currentTarget.elements[1] as HTMLInputElement;

    const isValidEmail = validateEmail(email.value);

    if (!isValidEmail) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }

    if (!password.value) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    if (isValidEmail && password.value) {
      try {
        await login(apiClient, {
          email: email.value,
          password: password.value,
        });
        window.location.reload();
      } catch (err) {
        setEmailError(true);
        setPasswordError(true);
        console.log(err);
      }
    }
  };

  return (
    <>
      <div className={classes.root}>
        <form
          noValidate
          autoComplete="off"
          className={classes.signInForm}
          onSubmit={onSubmit}
        >
          <Grid container spacing={3}>
            <Typography variant={"h4"}>
              {<StoreIcon fontSize="inherit" />} D/q Storehouse
            </Typography>

            <Grid item xs={12}>
              <TextField
                required
                id="standard-required"
                label="E-mail"
                error={emailError}
                helperText={emailError && "Incorrect entry."}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="standard-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                error={passwordError}
                helperText={passwordError && "Incorrect entry."}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<VpnKeyIcon />}
                fullWidth
                type="submit"
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
};
