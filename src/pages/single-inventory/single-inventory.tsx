import { AxiosInstance } from "axios";
import React, { FunctionComponent, useEffect } from "react";
import { useState } from "react";
import { RouteComponentProps, useParams } from "react-router-dom";
import { getInventoryById, InventoryByIdResponse } from "../../api";
import { Layout } from "../../components/layout/layout";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {
  DataGrid,
  GridColDef,
  GridEditCellPropsParams,
} from "@material-ui/data-grid";
import {
  createProduct,
  createProductCategory,
  createProductDetails,
} from "../../api/product";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { createCategory } from "../../api/category";
import MenuItem from "@material-ui/core/MenuItem";
import { useTranslation } from "react-i18next";

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ padding: 0 }}
      {...other}
    >
      {value === index && (
        <Box p={3} style={{ padding: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

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
      </Dialog>
    </>
  );
};

// export interface Category {
//   id: number;
//   publicId: string;
//   createdAt: Date;
//   updatedAt: Date;
//   name: string;
//   code: string;
// }

// export interface Product {
// id: number;
// publicId: string;
// createdAt: Date;
// updatedAt: Date;
// name: string;
// code: string;
// sellingPrice: number;
// quantity: number;
// productCategories: {
//   id: number;
//   category: Category;
// };
// }
