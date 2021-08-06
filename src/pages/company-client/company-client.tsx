import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import { DataGrid, GridColDef, GridToolbar } from "@material-ui/data-grid";
import { AxiosInstance } from "axios";
import React, { FunctionComponent, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import AddIcon from "@material-ui/icons/Add";
import { useTranslation } from "react-i18next";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hooks";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import { snackbarError, snackbarSuccess } from "../../actions/snackbar.action";
import {
  handleSuccessMessage,
  SuccessMessage,
} from "../../helpers/handle-success-message.helper";
import { handleErrorMessage } from "../../helpers/handle-error-message.helper";
import { Grid, TextField } from "@material-ui/core";
import { v4 as uuid } from "uuid";
import InputMask from "react-input-mask";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { BankInfo } from "../../entities";
import { createCompanyClient, getCompanyClients } from "../../api";
import {
  setCompanyClient,
  setCompanyClients,
} from "../../actions/company-client.action";
import { loadingFinished, loadingStarted } from "../../actions/loading.action";

interface CompanyClientProps extends RouteComponentProps {
  apiClient: AxiosInstance;
}

const useStyles = makeStyles((theme: Theme) => ({
  addButton: {
    marginTop: 25,
    marginBottom: 25,
    marginRight: 25,
  },
}));

export const CompanyClient: FunctionComponent<CompanyClientProps> = ({
  apiClient,
}) => {
  const [dialog, setOpenDialog] = useState(false);
  const [dialogError, setDialogError] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [translate] = useTranslation("common");
  const classes = useStyles();
  const bankInfo = useAppSelector((state) => state.bankInfo);
  const clients = useAppSelector((state) => state.companyClients);

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
      required: false,
      label: translate("dashboard.dialog.form.field.email"),
    },
    {
      name: "city",
      type: "city",
      required: false,
      mask: "",
      label: translate("dashboard.dialog.form.field.city"),
    },
    {
      name: "street",
      type: "street",
      required: false,
      mask: "",
      label: translate("dashboard.dialog.form.field.street"),
    },
    {
      name: "postalCode",
      type: "postalCode",
      required: false,
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
      name: "phoneFaxNumber",
      type: "phoneFaxNumber",
      required: false,
      mask: "+381 099 999 99 99",
      label: translate("dashboard.dialog.form.field.phoneFaxNumber"),
    },
    {
      name: "phoneMobileNumber",
      type: "phoneMobileNumber",
      mask: "+381 099 999 99 99",
      required: false,
      label: translate("dashboard.dialog.form.field.phoneMobileNumber"),
    },
    {
      name: "bankName",
      type: "bankName",
      required: false,
      mask: "",
      label: translate("dashboard.dialog.form.field.bankName"),
    },
    {
      name: "bankAccountNumber",
      type: "bankAccountNumber",
      required: false,
      mask: "999-9999999999999-99",
      label: translate("dashboard.dialog.form.field.bankAccountNumber"),
    },
  ];

  const companyClientColumns: GridColDef[] = [
    {
      field: "name",
      headerName: translate("dashboard.dialog.form.field.name"),
      width: 350,
    },
    {
      field: "email",
      headerName: translate("dashboard.dialog.form.field.email"),
      width: 200,
    },
    {
      field: "phoneFaxNumber",
      headerName: translate("dashboard.dialog.form.field.phoneFaxNumber"),
      width: 200,
    },
    {
      field: "phoneMobileNumber",
      headerName: translate("dashboard.dialog.form.field.phoneMobileNumber"),
      width: 200,
    },
  ];

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: any = {};
    for (const el of e.currentTarget.elements) {
      const element = el as HTMLInputElement;
      if (element.nodeName === "INPUT") {
        data[element.name] = element.value;
      }
    }

    try {
      const companyClient = await createCompanyClient(apiClient, data);
      dispatch(setCompanyClient(companyClient));
      dispatch(
        snackbarSuccess(
          handleSuccessMessage(SuccessMessage.COMPANY_CLIENT_CREATED, translate)
        )
      );
      setOpenDialog(false);
      setDialogError(false);
    } catch (error) {
      setDialogError(true);
      dispatch(
        snackbarError(
          handleErrorMessage(
            error.response.data.details.message || error.message,
            translate
          )
        )
      );
    }
  };

  useEffect(() => {
    const fetchCompanyClients = async () => {
      dispatch(loadingStarted());

      try {
        const companyClients = await getCompanyClients(apiClient);
        dispatch(setCompanyClients(companyClients));
      } catch (e) {
        console.error(e);
      }
      dispatch(loadingFinished());
    };

    fetchCompanyClients();
  }, []);

  return (
    <>
      <Typography variant="h4" component="h4">
        {translate("companyClient.title")}
      </Typography>

      <Button
        startIcon={<AddIcon />}
        variant="contained"
        color="primary"
        className={classes.addButton}
        onClick={handleClickOpen}
      >
        {translate("companyClient.button.addClient")}
      </Button>
      <div style={{ width: "100%" }}>
        <DataGrid
          rows={clients}
          columns={companyClientColumns}
          pageSize={20}
          autoHeight={true}
          autoPageSize={true}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </div>
      <Dialog
        open={dialog}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <DialogTitle id="form-dialog-title">
            {translate("companyClient.dialog.title")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {translate("companyClient.dialog.description")}
            </DialogContentText>
            <Grid container spacing={3}>
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
                            error={field.required && dialogError}
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
                            error={field.required && dialogError}
                          />
                        );
                      }}
                    </InputMask>
                  )}
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary" variant="contained">
              {translate("companyClient.dialog.cancel")}
            </Button>
            <Button type="submit" color="primary" variant="contained">
              {translate("companyClient.dialog.submit")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
