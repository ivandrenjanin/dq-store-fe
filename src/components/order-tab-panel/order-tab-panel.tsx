import { AxiosInstance } from "axios";
import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

import Button from "@material-ui/core/Button";

import { makeStyles, Theme } from "@material-ui/core/styles";
import { DataGrid, GridColDef, GridToolbar } from "@material-ui/data-grid";
import AddIcon from "@material-ui/icons/Add";
import { Order } from "../../api";

const useStyles = makeStyles((theme: Theme) => ({
  addButton: {
    marginTop: 25,
    marginBottom: 25,
    marginRight: 25,
  },
}));

interface OrderTabPanelProps {
  apiClient: AxiosInstance;
  inventoryId: string;
  orders: Order[];
  handleSetInventory: () => Promise<void>;
}

export const OrderTabPanel: FunctionComponent<OrderTabPanelProps> = ({
  apiClient,
  inventoryId,
  orders,
  handleSetInventory,
}) => {
  const [translate] = useTranslation("common");
  const classes = useStyles();

  const handleDownloadClick = () => {
    // getOrderInvoice(apiClient, 1, 1)
  };

  const mappedOrders = orders.map((d) => ({
    ...d,
    products: d.productOrders.map((x) => x.product.name).join(", "),
  }));

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

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        color="primary"
        className={classes.addButton}
        onClick={handleDownloadClick}
      >
        {translate("singleInventory.button.downloadOrderInvoice")}
      </Button>
      <div style={{ width: "100%" }}>
        <DataGrid
          rows={mappedOrders}
          columns={orderColumns}
          pageSize={20}
          autoHeight={true}
          autoPageSize={true}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </div>
    </>
  );
};
