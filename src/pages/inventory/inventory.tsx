import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { AxiosInstance } from "axios";
import React, { useEffect, useState, FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router-dom";
import {
  createInventory,
  getInventories,
  getInventoryById,
  InventoryByIdResponse,
} from "../../api";

import { Layout } from "../../components/layout/layout";
import { BasicTable } from "./table";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

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

export const Inventory: FunctionComponent<InventoryProps> = ({
  history,
  location,
  match,
  apiClient,
}) => {
  const [translate] = useTranslation("common");
  const [populatedInventories, setPopulatedInventories] = useState<
    InventoryByIdResponse[]
  >([]);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
    const newInventory = await createInventory(apiClient, data);
    const populated = await getInventoryById(apiClient, newInventory.id);
    const newData = populatedInventories;
    newData.push(populated);
    setPopulatedInventories(newData);
    setOpen(false);
  };

  const classes = useStyles();

  useEffect(() => {
    const fetchInventories = async () => {
      const inventories = await getInventories(apiClient);
      const arr: InventoryByIdResponse[] = [];
      for (const inventory of inventories) {
        const populated = await getInventoryById(apiClient, inventory.id);
        arr.push(populated);
      }

      setPopulatedInventories(arr);
    };

    fetchInventories();
  }, []);

  return (
    <>
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
        <BasicTable rows={populatedInventories} />
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
