import { AxiosError, AxiosInstance } from "axios";
import { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, RouteComponentProps } from "react-router-dom";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import { v4 as uuid } from "uuid";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import { CompanyResponse, getCompany, createCompany } from "../../api/company";

export interface CompanyProps extends RouteComponentProps {
  apiClient: AxiosInstance;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    list: {
      display: "flex",
      flexDirection: "column",
      paddingTop: 25,
      "& div": {
        display: "flex",
        flexDirection: "column",
        padding: 10,
      },
      "& div:nth-child(even)": {
        backgroundColor: "rgba(0,0,0, 0.1)",
      },
      "& div:nth-child(odd)": {
        backgroundColor: "rgba(0,0,0, 0.05)",
      },
    },
    link: {
      textDecoration: "none",
      color: "inherit",
    },
    listHeader: {
      fontWeight: "bold",
      marginRight: 5,
    },
    listValue: {},
    button: {
      marginTop: 25,
    },
  })
);

export const Company: FunctionComponent<CompanyProps> = ({ apiClient }) => {
  const classes = useStyles();
  const [translate] = useTranslation("common");
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [createCompanyDialog, setCreateCompanyDialog] =
    useState<boolean>(false);
  const [companyDialogError, setCompanyDialogError] = useState<boolean>(false);

  useEffect(() => {
    const fetchCompany = async () => {
      const company = await getCompany(apiClient);
      setCompany(company);
    };

    fetchCompany();
  }, []);

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
        <div className={classes.root}>
          <Typography variant="h4" component="h4">
            {translate("company.pageDescription")}
          </Typography>

          <div className={classes.list}>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.name`)}:
              </span>
              <span className={classes.listValue}>{company.name}</span>
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.websiteURL`)}:
              </span>
              <span className={classes.listValue}>{company.websiteURL}</span>
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.email`)}:
              </span>
              <span className={classes.listValue}>{company.email}</span>
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.phoneFaxNumber`)}:
              </span>
              <span className={classes.listValue}>
                {company.phoneFaxNumber}
              </span>
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.phoneMobileNumber`)}:
              </span>
              <span className={classes.listValue}>
                {company.phoneMobileNumber}
              </span>
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.postalCode`)}:
              </span>
              <span className={classes.listValue}> {company.postalCode}</span>
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.taxIdNumber`)}:
              </span>
              <span className={classes.listValue}>{company.taxIdNumber}</span>
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.companyNumber`)}:
              </span>
              <span className={classes.listValue}>{company.companyNumber}</span>
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.activityCode`)}:
              </span>
              <span className={classes.listValue}>{company.activityCode}</span>
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.bankName`)}:
              </span>
              <span className={classes.listValue}>{company.bankName}</span>
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.bankAccountNumber`)}:
              </span>
              <span className={classes.listValue}>
                {company.bankAccountNumber}
              </span>
            </Box>
          </div>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
          >
            <Link to={`/company/${company.id}`} className={classes.link}>
              {translate("company.button.edit")}
            </Link>
          </Button>
        </div>
      )}
    </>
  );
};
