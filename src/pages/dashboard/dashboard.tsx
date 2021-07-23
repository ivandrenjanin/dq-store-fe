import { AxiosError } from "axios";
import React, { FunctionComponent } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { CompanyResponse, createCompany, getCompany } from "../../api/company";
import { DashboardProps } from "./interfaces/dashboard-props.interface";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";

export const Dashboard: FunctionComponent<DashboardProps> = ({
  apiClient,
  history,
}) => {
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [createCompanyDialog, setCreateCompanyDialog] =
    useState<boolean>(false);

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

  const handleClose = () => {
    setCreateCompanyDialog(false);
    localStorage.removeItem("accessToken");
    history.push("/");
  };

  const handleSubmitCompany = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: any = {};
    for (const el of e.currentTarget.elements) {
      const element = el as HTMLInputElement;
      if (element.nodeName === "INPUT") {
        data[element.name] = element.value;
      }
    }
    const company = await createCompany(apiClient, data);
    setCompany(company);
    setCreateCompanyDialog(false);
  };
  return (
    <>
      <h4>Dashboard page for {company?.name ?? ""}</h4>

      <Dialog open={createCompanyDialog} onClose={handleClose}>
        <form noValidate autoComplete="off" onSubmit={handleSubmitCompany}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <DialogTitle id="form-dialog-title">
                Missing Company Info
              </DialogTitle>
            </Grid>

            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <DialogContentText>
                    Please add your company info.
                  </DialogContentText>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    type="name"
                    name="name"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="postalCode"
                    label="postalCode"
                    type="postalCode"
                    name="postalCode"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="taxIdNumber"
                    label="taxIdNumber"
                    type="taxIdNumber"
                    name="taxIdNumber"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="companyNumber"
                    label="companyNumber"
                    type="companyNumber"
                    name="companyNumber"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="activityCode"
                    label="activityCode"
                    type="activityCode"
                    name="activityCode"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="bankName"
                    label="bankName"
                    type="bankName"
                    name="bankName"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="bankAccountNumber"
                    label="bankAccountNumber"
                    type="bankAccountNumber"
                    name="bankAccountNumber"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="phoneFaxNumber"
                    label="phoneFaxNumber"
                    type="phoneFaxNumber"
                    name="phoneFaxNumber"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="phoneMobileNumber"
                    label="phoneMobileNumber"
                    type="phoneMobileNumber"
                    name="phoneMobileNumber"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    label="email"
                    type="email"
                    name="email"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="websiteURL"
                    label="websiteURL"
                    type="websiteURL"
                    name="websiteURL"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <Grid item xs={12}>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  Submit
                </Button>
              </DialogActions>
            </Grid>
          </Grid>
        </form>
      </Dialog>
    </>
  );
};
