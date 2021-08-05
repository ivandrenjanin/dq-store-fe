import { AxiosInstance } from "axios";
import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

import Button from "@material-ui/core/Button";

import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridToolbar,
} from "@material-ui/data-grid";
import { Order } from "../../api";
import { getOrderInvoice } from "../../api/order/get-order-invoice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hooks";
import { snackbarError, snackbarSuccess } from "../../actions/snackbar.action";
import {
  handleSuccessMessage,
  SuccessMessage,
} from "../../helpers/handle-success-message.helper";
import { handleErrorMessage } from "../../helpers/handle-error-message.helper";
import { loadingFinished, loadingStarted } from "../../actions/loading.action";

const useStyles = makeStyles((theme: Theme) => ({
  addButton: {
    marginTop: 25,
    marginBottom: 25,
    marginRight: 25,
  },
  noButtons: {
    height: 86,
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
  const isLoading = useAppSelector((state) => state.loading.value);
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const handleDownloadClick = async (orderId: number) => {
    dispatch(loadingStarted());
    try {
      await getOrderInvoice(apiClient, inventoryId, orderId.toString());
      dispatch(
        snackbarSuccess(
          handleSuccessMessage(SuccessMessage.PRODUCT_CREATED, translate)
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
    {
      field: "id",
      headerName: translate("singleInventory.button.downloadOrderInvoice"),
      width: 300,
      renderCell: (params: GridCellParams) => (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          style={{ marginLeft: 16 }}
          onClick={() => handleDownloadClick(params.value as number)}
          disabled={isLoading}
        >
          {translate("singleInventory.button.downloadOrderInvoiceButton")}
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className={classes.noButtons} />
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
