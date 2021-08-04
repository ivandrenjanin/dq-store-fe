import { AxiosInstance } from "axios";
import React, { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { DataGrid, GridColDef, GridToolbar } from "@material-ui/data-grid";
import AddIcon from "@material-ui/icons/Add";

import { Category, createCategory } from "../../api";
import { handleErrorMessage } from "../../helpers/handle-error-message.helper";
import {
  handleSuccessMessage,
  SuccessMessage,
} from "../../helpers/handle-success-message.helper";
import { useAppDispatch } from "../../hooks/redux.hooks";
import { snackbarError, snackbarSuccess } from "../../actions/snackbar.action";

const useStyles = makeStyles((theme: Theme) => ({
  addButton: {
    marginTop: 25,
    marginBottom: 25,
    marginRight: 25,
  },
}));

interface CategoryTabPanelProps {
  apiClient: AxiosInstance;
  inventoryId: string;
  categories: Category[];
  isLoading: boolean;
  handleSetInventory: () => Promise<void>;
}

export const CategoryTabPanel: FunctionComponent<CategoryTabPanelProps> = ({
  categories,
  inventoryId,
  apiClient,
  handleSetInventory,
  isLoading,
}) => {
  const [dialog, setOpenDialog] = useState(false);
  const [dialogError, setDialogError] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const [translate] = useTranslation("common");
  const classes = useStyles();

  const categoryColumns: GridColDef[] = [
    {
      field: "name",
      headerName: translate("singleInventory.list.product.name"),
      width: 200,
    },
    {
      field: "code",
      headerName: translate("singleInventory.list.product.code"),
      width: 200,
    },
  ];

  const handleClickOpen = (target: string) => {
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
      await createCategory(apiClient, inventoryId, data);
      dispatch(
        snackbarSuccess(
          handleSuccessMessage(SuccessMessage.CATEGORY_CREATED, translate)
        )
      );
      await handleSetInventory();
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

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        color="primary"
        className={classes.addButton}
        onClick={() => handleClickOpen("category")}
      >
        {translate("singleInventory.button.addCategory")}
      </Button>
      <div style={{ width: "100%" }}>
        <DataGrid
          loading={isLoading}
          rows={categories}
          columns={categoryColumns}
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
            {translate("singleInventory.dialog.category.title")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {translate("singleInventory.dialog.category.description")}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={translate("singleInventory.dialog.category.name")}
              type="name"
              name="name"
              fullWidth
              variant="outlined"
              error={dialogError}
            />
            <TextField
              margin="dense"
              id="code"
              label={translate("singleInventory.dialog.category.code")}
              type="code"
              name="code"
              fullWidth
              variant="outlined"
              error={dialogError}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary" variant="contained">
              {translate("singleInventory.dialog.category.cancel")}
            </Button>
            <Button type="submit" color="primary" variant="contained">
              {translate("singleInventory.dialog.category.submit")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
