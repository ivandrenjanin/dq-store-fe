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

const productColumns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 200 },
  { field: "code", headerName: "Code", width: 200 },
  {
    field: "sellingPrice",
    headerName: "Selling Price",
    width: 200,
    editable: true,
  },
  { field: "quantity", headerName: "Quantity", width: 160, editable: true },
  { field: "category", headerName: "Category", width: 160, editable: true },
];

const categoryColumns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 200 },
  { field: "code", headerName: "Code", width: 200 },
];

export const SingleInventory: FunctionComponent<SingleInventoryProps> = ({
  apiClient,
  history,
  location,
  match,
}) => {
  const { id } = useParams<{ id: string }>();
  const [inventory, setInventory] = useState<InventoryByIdResponse | null>(
    null
  );
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [dialog, setOpen] = React.useState({ open: false, target: "" });

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
      await createProduct(apiClient, parseInt(id), {
        ...data,
        sellingPrice: parseInt(data.sellingPrice),
      });
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
            ? x.productCategories[0].category.name
            : "No category added",
      }))
    : [];

  const handleEditCellChangeCommittedOnProduct = React.useCallback(
    async ({ id: productId, field, props }: GridEditCellPropsParams) => {
      if (field === "quantity" && props && props.value) {
        const val = props.value as string;
        await createProductDetails(
          apiClient,
          parseInt(id),
          productId as number,
          parseInt(val)
        );
      }

      if (field === "category" && props && props.value && inventory) {
        const ctg = inventory.categories.find((c) => c.name === props.value);
        if (ctg) {
          await createProductCategory(
            apiClient,
            parseInt(id),
            productId as number,
            ctg.id
          );
        }
      }
    },
    []
  );

  return (
    <Layout history={history} location={location} match={match}>
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
              <Tab label="Products" {...a11yProps(0)} />
              <Tab label="Categories" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              color="primary"
              className={classes.addButton}
              onClick={() => handleClickOpen("product")}
            >
              Add Product
            </Button>
            <div style={{ height: 650, width: "100%" }}>
              <DataGrid
                rows={products}
                columns={productColumns}
                pageSize={10}
                onEditCellChangeCommitted={
                  handleEditCellChangeCommittedOnProduct
                }
              />
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              color="primary"
              className={classes.addButton}
              onClick={() => handleClickOpen("category")}
            >
              Add Category
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
            <DialogTitle id="form-dialog-title">Add a new product</DialogTitle>
            <DialogContent>
              <DialogContentText>Add a new product</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="name"
                name="name"
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="code"
                label="Code"
                type="code"
                name="code"
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="sellingPrice"
                label="Selling Price"
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
                Cancel
              </Button>
              <Button type="submit" color="primary" variant="contained">
                Submit
              </Button>
            </DialogActions>
          </form>
        )}
        {dialog.target === "category" && (
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <DialogTitle id="form-dialog-title">Add a new category</DialogTitle>
            <DialogContent>
              <DialogContentText>Add a new category</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="name"
                name="name"
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="code"
                label="Code"
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
                Cancel
              </Button>
              <Button type="submit" color="primary" variant="contained">
                Submit
              </Button>
            </DialogActions>
          </form>
        )}
      </Dialog>
    </Layout>
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
