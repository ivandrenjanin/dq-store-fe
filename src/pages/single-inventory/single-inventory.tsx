import { AxiosInstance } from "axios";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps, useParams } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import TextField from "@material-ui/core/TextField";
import {
  DataGrid,
  GridCellEditCommitParams,
  GridColDef,
  MuiEvent,
} from "@material-ui/data-grid";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import { getInventoryById, InventoryByIdResponse } from "../../api";
import { createCategory } from "../../api/category";
import {
  createProduct,
  createProductCategory,
  createProductDetails,
} from "../../api/product";
import { TabPanel } from "../../components/tab-panel/tab-panel";

interface SingleInventoryProps extends RouteComponentProps {
  apiClient: AxiosInstance;
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  addButton: {
    marginTop: 25,
    marginBottom: 25,
  },
}));

export const SingleInventory: FunctionComponent<SingleInventoryProps> = ({
  apiClient,
}) => {
  const { id } = useParams<{ id: string }>();
  const [translate] = useTranslation("common");
  const [inventory, setInventory] = useState<InventoryByIdResponse | null>(
    null
  );
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [productQuantityValue, setProductQuantityValue] = React.useState<{
    quantity: null | number;
    productId: null | number;
  }>({
    quantity: null,
    productId: null,
  });
  const [dialog, setOpen] = React.useState({ open: false, target: "" });

  const [category, setCategory] = React.useState("");

  const handleChangeCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value);
  };

  const handleClickOpen = (target: string) => {
    setOpen({ open: true, target });
  };

  const handleClose = () => {
    setOpen({ open: false, target: "" });
    setProductQuantityValue({
      quantity: null,
      productId: null,
    });
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
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

    if (dialog.target === "product") {
      const { category, ...rest } = data;
      const p = await createProduct(apiClient, parseInt(id), {
        ...rest,
        sellingPrice: parseInt(data.sellingPrice),
      });
      await createProductCategory(
        apiClient,
        parseInt(id),
        p.id,
        parseInt(category)
      );
      const result = await getInventoryById(apiClient, parseInt(id));
      setInventory(result);
    }

    if (dialog.target === "category") {
      await createCategory(apiClient, parseInt(id), data);
      const result = await getInventoryById(apiClient, parseInt(id));
      setInventory(result);
    }

    setOpen({ open: false, target: "" });
  };

  useEffect(() => {
    const fetchInventoryById = async () => {
      const result = await getInventoryById(apiClient, parseInt(id));
      setInventory(result);
    };

    fetchInventoryById();
  }, []);

  const products = inventory
    ? inventory.products.map((x) => ({
        ...x,
        category:
          x.productCategories.length > 0
            ? x.productCategories.map((c) => c.category.name).join(", ")
            : translate("singleInventory.noCategory"),
      }))
    : [];

  const productColumns: GridColDef[] = [
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
    {
      field: "sellingPrice",
      headerName: translate("singleInventory.list.product.sellingPrice"),
      width: 200,
    },
    {
      field: "quantity",
      headerName: translate("singleInventory.list.product.quantity"),
      width: 160,
      editable: true,
    },
    {
      field: "category",
      headerName: translate("singleInventory.category"),
      width: 160,
    },
  ];

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

  const handleQuantityCellEdit = async (
    params: GridCellEditCommitParams,
    event: MuiEvent<React.SyntheticEvent<Element, Event>>
  ) => {
    if (params.field === "quantity" && params && params.value) {
      const val = params.value as string;
      const productId = params.id as number;
      setOpen({ open: true, target: "productQuantity" });
      setProductQuantityValue({
        quantity: parseInt(val),
        productId: productId,
      });
    }
  };

  const handleSubmitProductDetails = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const data: any = {};
    for (const el of e.currentTarget.elements) {
      const element = el as HTMLInputElement;
      if (element.nodeName === "INPUT") {
        data[element.name] = element.value;
      }
    }

    if (productQuantityValue.productId && productQuantityValue.quantity) {
      await createProductDetails(
        apiClient,
        parseInt(id),
        productQuantityValue.productId,
        productQuantityValue.quantity,
        parseInt(data.sellingPrice as string)
      );
    }
    setOpen({ open: false, target: "" });
    setProductQuantityValue({
      quantity: null,
      productId: null,
    });
  };

  return (
    <>
      {!inventory ? (
        <h1>Nothing here</h1>
      ) : (
        <div className={classes.root}>
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
            >
              <Tab
                label={translate("singleInventory.category")}
                {...a11yProps(0)}
              />
              <Tab
                label={translate("singleInventory.product")}
                {...a11yProps(1)}
              />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={1}>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              color="primary"
              className={classes.addButton}
              onClick={() => handleClickOpen("product")}
            >
              {translate("singleInventory.button.addProduct")}
            </Button>
            <div style={{ height: 650, width: "100%" }}>
              <DataGrid
                rows={products}
                columns={productColumns}
                pageSize={10}
                onCellEditCommit={handleQuantityCellEdit}
                autoHeight={true}
                autoPageSize={true}
              />
            </div>
          </TabPanel>
          <TabPanel value={value} index={0}>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              color="primary"
              className={classes.addButton}
              onClick={() => handleClickOpen("category")}
            >
              {translate("singleInventory.button.addCategory")}
            </Button>
            <div style={{ height: 650, width: "100%", padding: 0 }}>
              <DataGrid
                rows={inventory.categories}
                columns={categoryColumns}
                pageSize={10}
                autoHeight={true}
                autoPageSize={true}
              />
            </div>
          </TabPanel>
        </div>
      )}
      <Dialog
        open={dialog.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {dialog.target === "product" && (
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <DialogTitle id="form-dialog-title">
              {translate("singleInventory.dialog.product.title")}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {translate("singleInventory.dialog.product.description")}
              </DialogContentText>
              <TextField
                id="standard-select-category"
                select
                label={translate("singleInventory.dialog.product.category")}
                value={category}
                name="category"
                onChange={handleChangeCategory}
                helperText={translate(
                  "singleInventory.dialog.product.categoryHelper"
                )}
                fullWidth
              >
                {inventory?.categories.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label={translate("singleInventory.dialog.product.name")}
                type="name"
                name="name"
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="code"
                label={translate("singleInventory.dialog.product.code")}
                type="code"
                name="code"
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="sellingPrice"
                label={translate("singleInventory.dialog.product.sellingPrice")}
                type="number"
                name="sellingPrice"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                color="secondary"
                variant="contained"
              >
                {translate("singleInventory.dialog.product.cancel")}
              </Button>
              <Button type="submit" color="primary" variant="contained">
                {translate("singleInventory.dialog.product.submit")}
              </Button>
            </DialogActions>
          </form>
        )}
        {dialog.target === "category" && (
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
              />
              <TextField
                autoFocus
                margin="dense"
                id="code"
                label={translate("singleInventory.dialog.category.code")}
                type="code"
                name="code"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                color="secondary"
                variant="contained"
              >
                {translate("singleInventory.dialog.category.cancel")}
              </Button>
              <Button type="submit" color="primary" variant="contained">
                {translate("singleInventory.dialog.category.submit")}
              </Button>
            </DialogActions>
          </form>
        )}
        {dialog.target === "productQuantity" && (
          <form
            noValidate
            autoComplete="off"
            onSubmit={handleSubmitProductDetails}
          >
            <DialogTitle id="form-dialog-title">
              {translate("singleInventory.dialog.productQuantity.title")}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {translate(
                  "singleInventory.dialog.productQuantity.description"
                )}
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="sellingPrice"
                label={translate(
                  "singleInventory.dialog.productQuantity.primePrice"
                )}
                type="number"
                name="sellingPrice"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                color="secondary"
                variant="contained"
              >
                {translate("singleInventory.dialog.category.cancel")}
              </Button>
              <Button type="submit" color="primary" variant="contained">
                {translate("singleInventory.dialog.category.submit")}
              </Button>
            </DialogActions>
          </form>
        )}
      </Dialog>
    </>
  );
};
