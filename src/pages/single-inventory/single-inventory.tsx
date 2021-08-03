import { AxiosInstance } from "axios";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";

import { Typography } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import Slider from "@material-ui/core/Slider";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import TextField from "@material-ui/core/TextField";
import {
  DataGrid,
  GridCellEditCommitParams,
  GridColDef,
  GridRowId,
  GridRowParams,
  GridToolbar,
  MuiEvent,
} from "@material-ui/data-grid";
import AddIcon from "@material-ui/icons/Add";

import {
  createOrder,
  getInventoryById,
  InventoryByIdResponse,
  Product,
} from "../../api";
import { createCategory } from "../../api/category";
import { UnitOfMessure } from "../../api/enum/unit-of-messure.enum";
import {
  createProduct,
  createProductCategory,
  createProductDetails,
} from "../../api/product";
import { TabPanel } from "../../components/tab-panel/tab-panel";
import { getOrderInvoice } from "../../api/order/get-order-invoice";
import InputAdornment from "@material-ui/core/InputAdornment";

interface SingleInventoryProps extends RouteComponentProps {
  apiClient: AxiosInstance;
}

export function useForceUpdate() {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
  return update;
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
    marginRight: 25,
  },
  paper: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  dialogActions: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  dialogAdd: {
    alignSelf: "flex-start",
    padding: 15,
  },
  dialogFinalize: {
    alignSelf: "flex-end",
    padding: 15,
    "& button:first-child": {
      marginRight: 15,
    },
  },
  noButton: {
    height: 86,
  },
  orderForm: {
    marginBottom: 15,
  },
  orderFormDivider: {
    marginTop: 50,
    marginBottom: 50,
    backgroundColor: "grey",
  },
  hidden: {
    display: "none",
  },
}));

export const SingleInventory: FunctionComponent<SingleInventoryProps> = ({
  apiClient,
}) => {
  const { id } = useParams<{ id: string }>();
  const [translate] = useTranslation("common");
  const classes = useStyles();
  const [inventory, setInventory] = useState<InventoryByIdResponse | null>(
    null
  );
  const [value, setValue] = useState(0);
  const [productQuantityValue, setProductQuantityValue] = useState<{
    quantity: null | number;
    productId: null | number;
  }>({
    quantity: null,
    productId: null,
  });
  const [dialog, setOpen] = useState({ open: false, target: "" });
  const [category, setCategory] = useState("");
  const [unitOfMessure, setUnitOfMessure] = useState("");
  const [selectionProductModel, setSelectionProductModel] = React.useState<
    GridRowId[]
  >([]);

  const handleChangeCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value);
  };

  const handleChangeUnitOfMessure = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUnitOfMessure(event.target.value);
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
        primePrice: parseInt(data.primePrice),
        taxRate: parseInt(data.taxRate),
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
        unitOfMessure: translate(
          `singleInventory.list.product.unitOfMessureList.${x.unitOfMessure}`
        ),
      }))
    : [];

  const productColumns: GridColDef[] = [
    {
      field: "category",
      headerName: translate("singleInventory.category"),
      width: 160,
    },
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
      field: "quantity",
      headerName: translate("singleInventory.list.product.quantity"),
      width: 160,
      editable: true,
    },
    {
      field: "unitOfMessure",
      headerName: translate("singleInventory.list.product.unitOfMessure"),
      width: 200,
    },
    {
      field: "sellingPrice",
      headerName: translate("singleInventory.list.product.sellingPrice"),
      width: 200,
    },
    {
      field: "primePrice",
      // headerName: translate("singleInventory.list.product.sellingPrice"),
      headerName: "Nabavna Cena",
      width: 200,
    },
    {
      field: "taxRate",
      // headerName: translate("singleInventory.list.product.sellingPrice"),
      headerName: "PDV (%)",
      valueFormatter: (param) => {
        return `${param.value}%`;
      },
      width: 200,
    },
    {
      field: "taxedPrice",
      // headerName: translate("singleInventory.list.product.sellingPrice"),
      headerName: "Cena sa PDV-om",
      width: 200,
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

  const orders = inventory
    ? inventory.orders.map((d) => ({
        ...d,
        products: d.productOrders.map((x) => x.product.name).join(", "),
      }))
    : [];

  const orderColumns: GridColDef[] = [
    {
      field: "products",
      headerName: translate("singleInventory.list.order.products"),
      width: 200,
    },
    {
      field: "total",
      headerName: translate("singleInventory.list.order.total"),
      width: 260,
    },
    {
      field: "createdAt",
      headerName: translate("singleInventory.list.order.createdAt"),
      valueFormatter: (params) => {
        const d = new Date(params.value as string);

        return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} | ${d.getHours()}:${d.getMinutes()}`;
      },
      width: 260,
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
    // const data: any = {};
    // for (const el of e.currentTarget.elements) {
    //   const element = el as HTMLInputElement;
    //   if (element.nodeName === "INPUT") {
    //     data[element.name] = element.value;
    //   }
    // }

    if (productQuantityValue.productId && productQuantityValue.quantity) {
      const pr = products.find(
        (x) => x.id === productQuantityValue.productId
      ) as Product;
      await createProductDetails(
        apiClient,
        parseInt(id),
        productQuantityValue.productId,
        productQuantityValue.quantity,
        pr.primePrice
      );
    }
    setOpen({ open: false, target: "" });
    setProductQuantityValue({
      quantity: null,
      productId: null,
    });
    const result = await getInventoryById(apiClient, parseInt(id));
    setInventory(result);
  };

  const handleSubmitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: any = [];
    let d: any = {};
    let i = 0;
    for (const el of e.currentTarget.elements) {
      const element = el as HTMLInputElement;
      if (element.nodeName === "INPUT") {
        console.log({ [element.name]: element.value });
        d[element.name] = parseInt(element.value);
        if (i === 1) {
          i = 0;
          data.push(d);
          d = {};
        } else {
          i++;
        }
      }
    }

    await createOrder(apiClient, parseInt(id), { order: data });
    const result = await getInventoryById(apiClient, parseInt(id));
    setInventory(result);
    setOpen({ open: false, target: "" });
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
              <Tab
                label={translate("singleInventory.order")}
                {...a11yProps(2)}
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
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              color="primary"
              className={classes.addButton}
              disabled={selectionProductModel.length === 0}
              onClick={() => handleClickOpen("order")}
            >
              {selectionProductModel.length > 0
                ? translate("singleInventory.button.addNewOrder")
                : translate("singleInventory.button.addNewOrderDisabled")}
            </Button>
            <div style={{ width: "100%" }}>
              <DataGrid
                rows={products}
                columns={productColumns}
                pageSize={20}
                onCellEditCommit={handleQuantityCellEdit}
                autoHeight={true}
                autoPageSize={true}
                checkboxSelection={true}
                onSelectionModelChange={(newSelectionModel) => {
                  setSelectionProductModel(newSelectionModel);
                }}
                selectionModel={selectionProductModel}
                components={{
                  Toolbar: GridToolbar,
                }}
                isRowSelectable={(params: GridRowParams) =>
                  params.row.quantity > 0
                }
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
            <div style={{ width: "100%" }}>
              <DataGrid
                rows={inventory.categories}
                columns={categoryColumns}
                pageSize={20}
                autoHeight={true}
                autoPageSize={true}
                components={{
                  Toolbar: GridToolbar,
                }}
              />
            </div>
          </TabPanel>
          <TabPanel value={value} index={2}>
            {/* <div className={classes.noButton} /> */}
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              color="primary"
              className={classes.addButton}
              onClick={() => getOrderInvoice(apiClient, 1, 1)}
            >
              {translate("singleInventory.button.downloadOrderInvoice")}
            </Button>
            <div style={{ width: "100%" }}>
              <DataGrid
                rows={orders}
                columns={orderColumns}
                pageSize={20}
                autoHeight={true}
                autoPageSize={true}
                checkboxSelection={true}
                components={{
                  Toolbar: GridToolbar,
                }}
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
                autoFocus
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
                variant="outlined"
              >
                {inventory?.categories.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="standard-select-unit-of-messure"
                select
                label={translate("singleInventory.list.product.unitOfMessure")}
                value={unitOfMessure}
                name="unitOfMessure"
                onChange={handleChangeUnitOfMessure}
                helperText={translate(
                  "singleInventory.list.product.unitOfMessure"
                )}
                fullWidth
                variant="outlined"
              >
                {Object.values(UnitOfMessure).map((option) => (
                  <MenuItem key={option} value={option}>
                    {translate(
                      `singleInventory.dialog.product.unitOfMessureList.${option}`
                    )}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="dense"
                id="name"
                label={translate("singleInventory.dialog.product.name")}
                type="name"
                name="name"
                fullWidth
                variant="outlined"
              />
              <TextField
                margin="dense"
                id="code"
                label={translate("singleInventory.dialog.product.code")}
                type="code"
                name="code"
                fullWidth
                variant="outlined"
              />
              <TextField
                margin="dense"
                id="sellingPrice"
                label={translate("singleInventory.dialog.product.sellingPrice")}
                type="number"
                name="sellingPrice"
                fullWidth
                variant="outlined"
              />
              <TextField
                margin="dense"
                id="primePrice"
                label={translate("singleInventory.dialog.product.primePrice")}
                type="number"
                name="primePrice"
                fullWidth
                variant="outlined"
              />
              <TextField
                margin="dense"
                id="taxRate"
                label={translate("singleInventory.dialog.product.taxRate")}
                type="number"
                name="taxRate"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                fullWidth
                variant="outlined"
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
                variant="outlined"
              />
              <TextField
                margin="dense"
                id="code"
                label={translate("singleInventory.dialog.category.code")}
                type="code"
                name="code"
                fullWidth
                variant="outlined"
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
                  "singleInventory.dialog.productQuantity.descriptionStart"
                )}{" "}
                {productQuantityValue.quantity}{" "}
                {translate(
                  "singleInventory.dialog.productQuantity.descriptionEnd"
                )}
              </DialogContentText>
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
        {dialog.target === "order" && (
          <form noValidate autoComplete="off" onSubmit={handleSubmitOrder}>
            <DialogTitle id="form-dialog-title">
              {translate("singleInventory.dialog.order.title")}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {translate("singleInventory.dialog.order.description")}
              </DialogContentText>
              {selectionProductModel.map((id, i, arr) => {
                const product = inventory?.products.find(
                  (x) => x.id === id
                ) as Product;

                return (
                  <div className={classes.orderForm} key={uuid()}>
                    <Typography>
                      {" "}
                      {translate("singleInventory.dialog.order.formDesc")}:{" "}
                      <b>{product.name}</b>
                    </Typography>
                    <TextField
                      className={classes.hidden}
                      margin="dense"
                      label={product.name}
                      value={product.id}
                      disabled={true}
                      type="number"
                      name="productId"
                      fullWidth
                      variant="outlined"
                    />
                    <Slider
                      name="quantity"
                      defaultValue={1}
                      aria-labelledby="discrete-slider-always"
                      step={1}
                      marks={[
                        { value: 1, label: 1 },
                        {
                          value: Math.round(product.quantity / 2),
                          label: Math.round(product.quantity / 2),
                        },
                        { value: product.quantity, label: product.quantity },
                      ]}
                      min={1}
                      max={product.quantity}
                      valueLabelDisplay="auto"
                    />
                  </div>
                );
              })}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                color="secondary"
                variant="contained"
              >
                {translate("singleInventory.dialog.order.cancel")}
              </Button>
              <Button type="submit" color="primary" variant="contained">
                {translate("singleInventory.dialog.order.submit")}
              </Button>
            </DialogActions>
          </form>
        )}
      </Dialog>
    </>
  );
};
