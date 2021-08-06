import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { AxiosInstance } from "axios";
import React, { useEffect, useState, FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router-dom";
import { createInventory, getInventories, getInventoryById } from "../../api";

import { BasicTable } from "./table";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hooks";
import { Loader } from "../../components/loader/loader";
import { loadingFinished, loadingStarted } from "../../actions/loading.action";
import {
  handleSuccessMessage,
  SuccessMessage,
} from "../../helpers/handle-success-message.helper";
import { snackbarError, snackbarSuccess } from "../../actions/snackbar.action";
import { handleErrorMessage } from "../../helpers/handle-error-message.helper";
import { Inventory as InventoryEntity } from "../../entities";
import { setInventories, setInventory } from "../../actions/inventory.action";

export interface InventoryProps extends RouteComponentProps {
  apiClient: AxiosInstance;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    addButton: {
      marginTop: 25,
    },
  })
);

export const Inventory: FunctionComponent<InventoryProps> = ({ apiClient }) => {
  const [translate] = useTranslation("common");
  const [open, setOpen] = React.useState(false);
  const inventories = useAppSelector((state) => state.inventories);
  const isLoading = useAppSelector((state) => state.loading.value);
  const dispatch = useAppDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const newInventory = await createInventory(apiClient, data);
      const populated = await getInventoryById(apiClient, newInventory.id);
      dispatch(setInventory(populated));
      setOpen(false);

      dispatch(
        snackbarSuccess(
          handleSuccessMessage(SuccessMessage.INVENTORY_CREATED, translate)
        )
      );
    } catch (error) {
      dispatch(
        snackbarError(
          handleErrorMessage(
            error.response.data.details.message || error.message,
            translate
          )
        )
      );
    }
    dispatch(loadingFinished());
  };

  const classes = useStyles();

  useEffect(() => {
    const fetchInventories = async () => {
      dispatch(loadingStarted());
      const inventories = await getInventories(apiClient);
      const i = [];
      for (const inventory of inventories) {
        const populated = await getInventoryById(apiClient, inventory.id);
        i.push(populated);
      }
      dispatch(setInventories(i));
      dispatch(loadingFinished());
    };

    fetchInventories();
  }, []);

  return (
    <>
      <Loader isLoading={isLoading} />
      <div className={classes.root}>
        <Typography variant="h4" component="h4">
          {translate("inventory.pageDescription")}
        </Typography>
        <Button
          onClick={handleClickOpen}
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          className={classes.addButton}
        >
          {translate("inventory.inventoryTable.button.add")}
        </Button>
        <BasicTable rows={inventories} />
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <DialogTitle id="form-dialog-title">
              {translate("inventory.dialog.title")}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {translate("inventory.dialog.description")}
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label={translate("inventory.dialog.label")}
                type="name"
                name="name"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                color="secondary"
                variant="contained"
              >
                {translate("inventory.dialog.button.cancel")}
              </Button>
              <Button type="submit" color="primary" variant="contained">
                {translate("inventory.dialog.button.submit")}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </>
  );
};
