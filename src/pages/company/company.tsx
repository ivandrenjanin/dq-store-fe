import { AxiosError, AxiosInstance } from "axios";
import { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InputMask from "react-input-mask";
import { Link, RouteComponentProps } from "react-router-dom";
import { v4 as uuid } from "uuid";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { loadingFinished, loadingStarted } from "../../actions/loading.action";
import { createCompany, getCompany } from "../../api/company";
import { Loader } from "../../components/loader/loader";
import { Company as CompanyEntity } from "../../entities";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hooks";

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

  const isLoading = useAppSelector((state) => state.loading.value);
  const dispatch = useAppDispatch();
  const bankInfo = useAppSelector((state) => state.bankInfo);

  const [company, setCompany] = useState<CompanyEntity | null>(null);
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
      dispatch(loadingStarted());

      try {
        const company = await getCompany(apiClient);
        setCompany(company);
      } catch (e) {
        const err = e as AxiosError;
        if (err.response?.status === 404) {
          setCreateCompanyDialog(true);
        } else {
          console.error(err);
        }
      }
      dispatch(loadingFinished());
    };

    fetchCompany();
  }, []);

  const handleSubmitCompany = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loadingStarted());
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
    dispatch(loadingFinished());
  };

  const dialogFormFields = [
    {
      name: "name",
      type: "name",
      required: true,
      mask: "",
      label: translate("dashboard.dialog.form.field.name"),
    },
    {
      name: "email",
      type: "email",
      mask: "",
      required: true,
      label: translate("dashboard.dialog.form.field.email"),
    },
    {
      name: "city",
      type: "city",
      required: true,
      mask: "",
      label: translate("dashboard.dialog.form.field.city"),
    },
    {
      name: "street",
      type: "street",
      required: true,
      mask: "",
      label: translate("dashboard.dialog.form.field.street"),
    },
    {
      name: "postalCode",
      type: "postalCode",
      required: true,
      mask: "",
      label: translate("dashboard.dialog.form.field.postalCode"),
    },
    {
      name: "taxIdNumber",
      type: "taxIdNumber",
      required: true,
      mask: "",
      label: translate("dashboard.dialog.form.field.taxIdNumber"),
    },
    {
      name: "companyNumber",
      type: "companyNumber",
      required: true,
      mask: "",
      label: translate("dashboard.dialog.form.field.companyNumber"),
    },
    {
      name: "activityCode",
      type: "activityCode",
      mask: "",
      required: true,
      label: translate("dashboard.dialog.form.field.activityCode"),
    },
    {
      name: "phoneFaxNumber",
      type: "phoneFaxNumber",
      required: true,
      mask: "+381 099 999 99 99",
      label: translate("dashboard.dialog.form.field.phoneFaxNumber"),
    },
    {
      name: "phoneMobileNumber",
      type: "phoneMobileNumber",
      mask: "+381 099 999 99 99",
      required: true,
      label: translate("dashboard.dialog.form.field.phoneMobileNumber"),
    },
    {
      name: "bankName",
      type: "bankName",
      required: true,
      mask: "",
      label: translate("dashboard.dialog.form.field.bankName"),
    },
    {
      name: "bankAccountNumber",
      type: "bankAccountNumber",
      required: true,
      mask: "999-9999999999999-99",
      label: translate("dashboard.dialog.form.field.bankAccountNumber"),
    },
  ];

  return (
    <>
      <Loader isLoading={isLoading} />
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
                      {field.name === "bankName" ? (
                        <Autocomplete
                          options={bankInfo.map((option) => option.name)}
                          renderInput={(params: any) => {
                            return (
                              <TextField
                                {...params}
                                variant="outlined"
                                color="primary"
                                autoFocus={i === 0 && true}
                                margin="dense"
                                id={field.name}
                                label={field.label}
                                type={field.type}
                                name={field.name}
                                fullWidth
                                required={field.required}
                                error={field.required && companyDialogError}
                              />
                            );
                          }}
                        />
                      ) : (
                        <InputMask mask={field.mask}>
                          {(inputProps: any) => {
                            return (
                              <TextField
                                {...inputProps}
                                variant="outlined"
                                color="primary"
                                autoFocus={i === 0 && true}
                                margin="dense"
                                id={field.name}
                                label={field.label}
                                type={field.type}
                                name={field.name}
                                fullWidth
                                required={field.required}
                                error={field.required && companyDialogError}
                              />
                            );
                          }}
                        </InputMask>
                      )}
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
                {translate(`company.city`)}:
              </span>
              <span className={classes.listValue}> {company.city}</span>
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.street`)}:
              </span>
              <span className={classes.listValue}> {company.street}</span>
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
            <Link to={`/firma/${company.id}`} className={classes.link}>
              {translate("company.button.edit")}
            </Link>
          </Button>
        </div>
      )}
    </>
  );
};
