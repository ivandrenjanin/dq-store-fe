import { AxiosInstance } from "axios";
import { DateTime } from "luxon";
import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

import Button from "@material-ui/core/Button";
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
    DataGrid, GridCellParams, GridColDef, GridToolbarColumnsButton, GridToolbarContainer,
    GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton
} from "@material-ui/data-grid";

import { loadingFinished, loadingStarted } from "../../actions/loading.action";
import { snackbarError, snackbarSuccess } from "../../actions/snackbar.action";
import { getOrderInvoice } from "../../api/order/get-order-invoice";
import { Order } from "../../entities";
import { formatNumber } from "../../helpers/format-number.helper";
import { handleErrorMessage } from "../../helpers/handle-error-message.helper";
import { handleSuccessMessage, SuccessMessage } from "../../helpers/handle-success-message.helper";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hooks";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport
        csvOptions={{
          fields: [
            "companyClient",
            "orderNumber",
            "total",
            "totalTaxed",
            "tax",
            "createdAt",
          ],
        }}
      />
    </GridToolbarContainer>
  );
}

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
}

export const OrderTabPanel: FunctionComponent<OrderTabPanelProps> = ({
  apiClient,
  inventoryId,
  orders,
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
    tax: d.totalTaxed - d.total,
    createdAtHidden: DateTime.fromJSDate(new Date(d.createdAt))
      .setLocale("sr-Latn-RS")
      .toFormat("LLLL"),
    products: d.productOrders.map((x) => x.product.name).join(", "),
    companyClient: d.companyClient.name,
  }));

  const orderColumns: GridColDef[] = [
    {
      field: "companyClient",
      headerName: translate("singleInventory.list.order.companyClient"),
      width: 200,
    },
    {
      field: "orderNumber",
      headerName: translate("singleInventory.list.order.orderNumber"),
      width: 180,
    },
    {
      field: "total",
      headerName: translate("singleInventory.list.order.total"),
      width: 170,
      valueFormatter: (params) => formatNumber(params.value as number),
    },
    {
      field: "totalTaxed",
      headerName: translate("singleInventory.list.order.totalTaxed"),
      width: 170,
      valueFormatter: (params) => formatNumber(params.value as number),
    },
    {
      field: "tax",
      headerName: translate("singleInventory.list.order.tax"),
      width: 190,
      valueFormatter: (params) => formatNumber(params.value as number),
    },
    {
      field: "createdAtHidden",
      headerName: translate("singleInventory.list.order.createdAtHidden"),
      width: 180,
      hide: true,
    },
    {
      field: "createdAt",
      headerName: translate("singleInventory.list.order.createdAt"),
      valueFormatter: (params) => {
        const d = DateTime.fromJSDate(new Date(params.value as string));

        return d.setLocale("sr-Latn-RS").toFormat("dd.LL.yyyy.");
      },
      width: 180,
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
            Toolbar: CustomToolbar,
          }}
          componentsProps={{
            toolbar: {
              csvOptions: {},
            },
          }}
        />
      </div>
    </>
  );
};
