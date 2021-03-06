import { AxiosInstance } from "axios";
import React, { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";

import { IconButton } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {
  DataGrid,
  GridCellEditCommitParams,
  GridCellParams,
  GridColDef,
  GridRowId,
  GridRowParams,
  GridToolbar,
  GridValueFormatterParams,
  MuiEvent,
} from "@material-ui/data-grid";
import AddIcon from "@material-ui/icons/Add";

import { snackbarError, snackbarSuccess } from "../../actions/snackbar.action";
import {
  createOrder,
  createProduct,
  createProductCategory,
  createProductDetails,
  updateProduct,
} from "../../api";
import { Category, Product } from "../../entities";
import { UnitOfMessure } from "../../entities/enum/unit-of-messure.enum";
import { formatNumber } from "../../helpers/format-number.helper";
import { handleErrorMessage } from "../../helpers/handle-error-message.helper";
import {
  handleSuccessMessage,
  SuccessMessage,
} from "../../helpers/handle-success-message.helper";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hooks";
import { InputSlider } from "../slider/slider";

const useStyles = makeStyles((theme: Theme) => ({
  addButton: {
    marginTop: 25,
    marginBottom: 25,
    marginRight: 25,
  },
  orderForm: {
    marginBottom: 15,
  },
  hidden: {
    display: "none",
  },
}));

interface ProductTabPanelProps {
  apiClient: AxiosInstance;
  inventoryId: string;
  products: Product[];
  categories: Category[];
  handleSetInventory: () => Promise<void>;
}

export const ProductTabPanel: FunctionComponent<ProductTabPanelProps> = ({
  apiClient,
  inventoryId,
  products,
  categories,
  handleSetInventory,
}) => {
  const [dialog, setOpenDialog] = useState(false);
  const [dialogQty, setOpenDialogQty] = useState(false);
  const [dialogOrder, setOpenDialogOrder] = useState(false);
  const [dialogError, setDialogError] = useState<boolean>(false);
  const [selectionModel, setSelectionModel] = React.useState<GridRowId[]>([]);
  const [category, setCategory] = useState("");
  const [selectedCompanyClient, setSelectedCompanyClient] = useState("");
  const [unitOfMessure, setUnitOfMessure] = useState("each");
  const [productIdForQuantity, setProductIdForQuantity] = useState<"" | number>(
    ""
  );
  const companyClients = useAppSelector((state) => state.companyClients);
  const dispatch = useAppDispatch();
  const [translate] = useTranslation("common");
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpenDialog(true);
    setDialogError(false);
  };

  const handleClickOpenOrder = () => {
    setOpenDialogOrder(true);
    setDialogError(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogError(false);
  };

  const handleCloseQty = () => {
    setOpenDialogQty(false);
    setDialogError(false);
    setProductIdForQuantity("");
  };

  const handleOpenQty = (productId: number) => {
    setOpenDialogQty(true);
    setProductIdForQuantity(productId);
    setDialogError(false);
  };

  const handleCloseOrder = () => {
    setOpenDialogOrder(false);
    setDialogError(false);
  };

  const handleChangeCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value);
  };

  const handleChangeCompanyClient = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedCompanyClient(event.target.value);
  };

  const handleChangeUnitOfMessure = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUnitOfMessure(event.target.value);
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

    const { category, quantity, ...rest } = data;
    try {
      const p = await createProduct(apiClient, inventoryId, {
        ...rest,
        primePrice: parseFloat(data.primePrice),
        taxRate: parseFloat(data.taxRate),
        sellingPrice: parseFloat(data.sellingPrice),
      });
      await createProductCategory(
        apiClient,
        inventoryId,
        p.id.toString(),
        parseInt(category)
      );
      await createProductDetails(
        apiClient,
        inventoryId,
        p.id.toString(),
        parseInt(quantity),
        p.primePrice
      );
      await handleSetInventory();
      setOpenDialog(false);
      setDialogError(false);
      dispatch(
        snackbarSuccess(
          handleSuccessMessage(SuccessMessage.PRODUCT_CREATED, translate)
        )
      );
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

    const pr = products.find((x) => x.id === productIdForQuantity) as Product;

    if (productIdForQuantity) {
      try {
        await createProductDetails(
          apiClient,
          inventoryId,
          productIdForQuantity.toString(),
          parseInt(data.quantity),
          pr.primePrice
        );
        setOpenDialogQty(false);
        setDialogError(false);
        setProductIdForQuantity("");
        await handleSetInventory();
        dispatch(
          snackbarSuccess(
            handleSuccessMessage(
              SuccessMessage.PRODUCT_DETAILS_CREATED,
              translate
            )
          )
        );
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
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: any = [];
    let d: any = {};
    let i = 0;
    for (const el of e.currentTarget.elements) {
      const element = el as HTMLInputElement;
      if (
        element.nodeName === "INPUT" &&
        element.name &&
        element.name !== "companyClientId"
      ) {
        d[element.name] = parseFloat(element.value);
        if (i === 1) {
          i = 0;
          data.push(d);
          d = {};
        } else {
          i++;
        }
      }
    }
    try {
      await createOrder(apiClient, inventoryId, {
        companyClientId: parseInt(selectedCompanyClient),
        order: data,
      });
      await handleSetInventory();
      setOpenDialogOrder(false);
      setDialogError(false);

      dispatch(
        snackbarSuccess(
          handleSuccessMessage(SuccessMessage.PRODUCT_ORDER_CREATED, translate)
        )
      );
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

  const mappedProducts = products.map((x) => ({
    ...x,
    category:
      x.productCategories.length > 0
        ? x.productCategories.map((c) => c.category.name).join(", ")
        : translate("singleInventory.noCategory"),
    unitOfMessure: translate(
      `singleInventory.list.product.unitOfMessureList.${x.unitOfMessure}`
    ),
  }));

  const formatNumberLocal = (params: GridValueFormatterParams) => {
    if (typeof params.value === "string") {
      return formatNumber(parseFloat(params.value));
    } else {
      return formatNumber(params.value as number);
    }
  };

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
      editable: true,
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
      renderCell: (params: GridCellParams) => (
        <>
          <div
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            <div>{params.value} </div>
            <IconButton
              aria-label="add-quantity"
              color="primary"
              onClick={() => handleOpenQty(params.id as number)}
            >
              <AddIcon />
            </IconButton>
          </div>
        </>
      ),
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
      valueFormatter: formatNumberLocal,
      editable: true,
    },
    {
      field: "primePrice",
      headerName: translate("singleInventory.list.product.primePrice"),
      width: 200,
      valueFormatter: formatNumberLocal,
      editable: true,
    },
    {
      field: "taxRate",
      headerName: translate("singleInventory.list.product.taxRate"),
      valueFormatter: (param) => {
        return `${param.value}%`;
      },
      width: 200,
      editable: true,
    },
    {
      field: "taxedPrice",
      headerName: translate("singleInventory.list.product.taxedPrice"),
      width: 200,
      valueFormatter: formatNumberLocal,
    },
  ];

  const handleEditProduct = async (
    params: GridCellEditCommitParams,
    event: MuiEvent<React.SyntheticEvent<Element, Event>>
  ) => {
    const numFields = ["taxedPrice", "taxRate", "primePrice", "sellingPrice"];
    try {
      let data = {};
      if (numFields.includes(params.field)) {
        data = {
          [params.field]: parseFloat(params.value as string),
        };
      } else {
        data = {
          [params.field]: params.value,
        };
      }
      await updateProduct(apiClient, inventoryId, params.id.toString(), data);
      await handleSetInventory();
      dispatch(
        snackbarSuccess(
          handleSuccessMessage(SuccessMessage.PRODUCT_UPDATED, translate)
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
  };

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        color="primary"
        className={classes.addButton}
        onClick={() => handleClickOpen()}
      >
        {translate("singleInventory.button.addProduct")}
      </Button>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        color="primary"
        className={classes.addButton}
        disabled={selectionModel.length === 0 || companyClients.length === 0}
        onClick={() => handleClickOpenOrder()}
      >
        {selectionModel.length > 0
          ? translate("singleInventory.button.addNewOrder")
          : translate("singleInventory.button.addNewOrderDisabled")}
      </Button>
      <div style={{ width: "100%" }}>
        <DataGrid
          rows={mappedProducts}
          columns={productColumns}
          pageSize={20}
          autoHeight={true}
          autoPageSize={true}
          checkboxSelection={true}
          onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          onCellEditCommit={handleEditProduct}
          // onEditCellPropsChange={handleEditProduct}
          selectionModel={selectionModel}
          components={{
            Toolbar: GridToolbar,
          }}
          isRowSelectable={(params: GridRowParams) => params.row.quantity > 0}
        />
      </div>
      <Dialog
        open={dialog}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
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
              error={dialogError}
            >
              {categories.map((option) => (
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
              defaultValue={UnitOfMessure.EACH}
              error={dialogError}
            >
              {Object.values(UnitOfMessure).map((option) => (
                <MenuItem key={option} value={option} selected>
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
              error={dialogError}
            />
            <TextField
              margin="dense"
              id="sellingPrice"
              label={translate("singleInventory.dialog.product.sellingPrice")}
              type="number"
              name="sellingPrice"
              fullWidth
              variant="outlined"
              error={dialogError}
            />
            <TextField
              margin="dense"
              id="primePrice"
              label={translate("singleInventory.dialog.product.primePrice")}
              type="number"
              name="primePrice"
              fullWidth
              variant="outlined"
              error={dialogError}
            />
            <TextField
              margin="dense"
              id="taxRate"
              label={translate("singleInventory.dialog.product.taxRate")}
              type="number"
              name="taxRate"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              defaultValue={20}
              fullWidth
              variant="outlined"
              error={dialogError}
            />
            <TextField
              margin="dense"
              id="quantity"
              label={translate("singleInventory.list.product.quantity")}
              type="number"
              name="quantity"
              fullWidth
              variant="outlined"
              error={dialogError}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
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
      </Dialog>
      <Dialog
        open={dialogQty}
        onClose={handleCloseQty}
        aria-labelledby="form-dialog-title"
      >
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
              {translate("singleInventory.dialog.productQuantity.description")}
            </DialogContentText>
            <TextField
              className={classes.hidden}
              margin="dense"
              id="productId"
              type="number"
              name="productId"
              fullWidth
              variant="outlined"
              value={productIdForQuantity}
              disabled={true}
            />
            <TextField
              margin="dense"
              id="quantity"
              label={translate("singleInventory.list.product.quantity")}
              type="number"
              name="quantity"
              fullWidth
              variant="outlined"
              error={dialogError}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseQty}
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
      </Dialog>
      <Dialog
        open={dialogOrder}
        onClose={handleCloseOrder}
        fullWidth
        aria-labelledby="form-dialog-title"
      >
        <form noValidate autoComplete="off" onSubmit={handleSubmitOrder}>
          <DialogTitle id="form-dialog-title">
            {translate("singleInventory.dialog.order.title")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {translate("singleInventory.dialog.order.description")}
            </DialogContentText>
            <TextField
              autoFocus
              select
              label={translate("singleInventory.dialog.product.companyClient")}
              value={selectedCompanyClient}
              name="companyClientId"
              onChange={handleChangeCompanyClient}
              helperText={translate(
                "singleInventory.dialog.product.companyClientHelper"
              )}
              fullWidth
              variant="outlined"
              error={dialogError}
            >
              {companyClients.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
            {selectionModel.map((id, i, arr) => {
              const product = products.find((x) => x.id === id) as Product;

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
                  <InputSlider
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
              onClick={handleCloseOrder}
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
      </Dialog>
    </>
  );
};
