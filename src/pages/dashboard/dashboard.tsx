import { AxiosError } from "axios";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import { CompanyResponse, createCompany, getCompany } from "../../api/company";
import { Layout } from "../../components/layout/layout";
import { DashboardProps } from "./interfaces/dashboard-props.interface";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  })
);

export const Dashboard: FunctionComponent<DashboardProps> = ({
  apiClient,
  history,
  location,
  match,
}) => {
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [createCompanyDialog, setCreateCompanyDialog] =
    useState<boolean>(false);
  const [companyDialogError, setCompanyDialogError] = useState<boolean>(false);
  const [translate] = useTranslation("common");
  const classes = useStyles();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const company = await getCompany(apiClient);
        setCompany(company);
      } catch (e) {
        const err = e as AxiosError;
        if (err.response?.status === 404) {
          console.log("COMPANY NOT FOUND");
          setCreateCompanyDialog(true);
        } else {
          console.error(err);
        }
      }
    };

    fetchCompany();
  }, []);

  const handleSubmitCompany = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: any = {};
    for (const el of e.currentTarget.elements) {
      const element = el as HTMLInputElement;
      if (element.nodeName === "INPUT") {
        data[element.name] = element.value;
      }
    }
    try {
      const company = await createCompany(apiClient, data);
      setCompany(company);
      setCreateCompanyDialog(false);
      setCompanyDialogError(false);
    } catch (e) {
      setCompanyDialogError(true);
    }
  };

  const dialogFormFields = [
    {
      name: "name",
      type: "name",
      label: translate("dashboard.dialog.form.field.name"),
    },
    {
      name: "postalCode",
      type: "postalCode",
      label: translate("dashboard.dialog.form.field.postalCode"),
    },
    {
      name: "taxIdNumber",
      type: "taxIdNumber",
      label: translate("dashboard.dialog.form.field.taxIdNumber"),
    },
    {
      name: "companyNumber",
      type: "companyNumber",
      label: translate("dashboard.dialog.form.field.companyNumber"),
    },
    {
      name: "activityCode",
      type: "activityCode",
      label: translate("dashboard.dialog.form.field.activityCode"),
    },
    {
      name: "bankName",
      type: "bankName",
      label: translate("dashboard.dialog.form.field.bankName"),
    },
    {
      name: "bankAccountNumber",
      type: "bankAccountNumber",
      label: translate("dashboard.dialog.form.field.bankAccountNumber"),
    },
    {
      name: "phoneFaxNumber",
      type: "phoneFaxNumber",
      label: translate("dashboard.dialog.form.field.phoneFaxNumber"),
    },
    {
      name: "phoneMobileNumber",
      type: "phoneMobileNumber",
      label: translate("dashboard.dialog.form.field.phoneMobileNumber"),
    },
    {
      name: "email",
      type: "email",
      label: translate("dashboard.dialog.form.field.email"),
    },
    {
      name: "websiteURL",
      type: "websiteURL",
      label: translate("dashboard.dialog.form.field.websiteURL"),
    },
  ];

  return (
    <>
      {!company ? (
        <Dialog open={createCompanyDialog}>
          <form noValidate autoComplete="off" onSubmit={handleSubmitCompany}>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <DialogTitle id="form-dialog-title">
                  {translate("dashboard.dialog.form.title")}
                </DialogTitle>
              </Grid>

              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <DialogContentText>
                      {companyDialogError
                        ? translate("dashboard.dialog.form.error")
                        : translate("dashboard.dialog.form.subTitle")}
                    </DialogContentText>
                  </Grid>
                  {dialogFormFields.map((field, i, arr) => (
                    <Grid
                      item
                      key={uuid()}
                      xs={i === arr.length - 1 && arr.length % 2 !== 0 ? 12 : 6}
                    >
                      <TextField
                        variant="outlined"
                        color="primary"
                        autoFocus
                        margin="dense"
                        id={field.name}
                        label={field.label}
                        type={field.type}
                        name={field.name}
                        fullWidth
                        error={companyDialogError}
                      />
                    </Grid>
                  ))}
                </Grid>
              </DialogContent>
              <Grid item xs={12}>
                <DialogActions>
                  <Button color="primary" type="submit" variant="contained">
                    {translate("dashboard.dialog.form.button.submit")}
                  </Button>
                </DialogActions>
              </Grid>
            </Grid>
          </form>
        </Dialog>
      ) : (
        <Layout history={history} location={location} match={match}>
          <div className={classes.root}>
            <Typography variant="h4" component="h4">
              {translate("dashboard.pageDescription")}
            </Typography>
          </div>
        </Layout>
      )}
    </>
  );
};
