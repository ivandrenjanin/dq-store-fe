import React, { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import VpnKeyIcon from "@material-ui/icons/VpnKey";

import { login } from "../../api";
import { Logo } from "../../components/logo/logo";
import { validateEmail } from "../../helpers/validate-email";
import { SignInProps } from "./interfaces/sign-in-props.interface";

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

export const SignIn: FunctionComponent<SignInProps> = ({
  apiClient,
  history,
}) => {
  const classes = useStyles();
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [translate] = useTranslation("common");

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
        history.push("/dashboard");
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
            <Logo variant="h4" />
            <Grid item xs={12}>
              <TextField
                required
                id="standard-required"
                label={translate("signup.email.label")}
                error={emailError}
                helperText={emailError && translate("signup.error")}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="standard-password-input"
                label={translate("signup.password.label")}
                type="password"
                autoComplete="current-password"
                error={passwordError}
                helperText={passwordError && translate("signup.error")}
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
                {translate("signup.button")}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
};
