import { AxiosInstance } from "axios";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps, useParams } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";

import { makeStyles, Theme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

import { getInventoryById, InventoryByIdResponse } from "../../api";

import { TabPanel } from "../../components/tab-panel/tab-panel";
import { CategoryTabPanel } from "../../components/category-tab-panel/category-tab-panel";
import { ProductTabPanel } from "../../components/product-tab-panel/product-tab-panel";
import { OrderTabPanel } from "../../components/order-tab-panel/order-tab-panel";

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
}));

export const SingleInventory: FunctionComponent<SingleInventoryProps> = ({
  apiClient,
}) => {
  const { id } = useParams<{ id: string }>();

  const [inventory, setInventory] = useState<InventoryByIdResponse | null>(
    null
  );
  const [value, setValue] = useState(0);

  const [translate] = useTranslation("common");
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchInventoryById = async () => {
      const result = await getInventoryById(apiClient, parseInt(id));
      setInventory(result);
    };

    fetchInventoryById();
  }, []);

  const handleSetInventory = async () => {
    const result = await getInventoryById(apiClient, parseInt(id));
    setInventory(result);
  };

  return (
    <>
      {inventory && (
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

          <TabPanel value={value} index={0}>
            <CategoryTabPanel
              apiClient={apiClient}
              inventoryId={id}
              categories={inventory.categories}
              handleSetInventory={handleSetInventory}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ProductTabPanel
              apiClient={apiClient}
              inventoryId={id}
              products={inventory.products}
              categories={inventory.categories}
              handleSetInventory={handleSetInventory}
            />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <OrderTabPanel
              apiClient={apiClient}
              inventoryId={id}
              orders={inventory.orders}
              handleSetInventory={handleSetInventory}
            />
          </TabPanel>
        </div>
      )}
    </>
  );
};
