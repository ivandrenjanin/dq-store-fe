import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { AxiosInstance } from "axios";
import React, { useEffect, useState, FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router-dom";
import {
  getInventories,
  getInventoryById,
  InventoryByIdResponse,
} from "../../api";

import { Layout } from "../../components/layout/layout";
import { BasicTable } from "./table";

export interface InventoryProps extends RouteComponentProps {
  apiClient: AxiosInstance;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  })
);

export const Inventory: FunctionComponent<InventoryProps> = ({
  history,
  location,
  match,
  apiClient,
}) => {
  const [translate] = useTranslation("common");
  const [populatedInventories, setPopulatedInventories] = useState<
    InventoryByIdResponse[]
  >([]);
  const classes = useStyles();

  useEffect(() => {
    const fetchInventories = async () => {
      const inventories = await getInventories(apiClient);
      const arr: InventoryByIdResponse[] = [];
      for (const inventory of inventories) {
        const populated = await getInventoryById(apiClient, inventory.id);
        arr.push(populated);
      }

      setPopulatedInventories(arr);
    };

    fetchInventories();
  }, []);

  return (
    <Layout history={history} location={location} match={match}>
      <div className={classes.root}>
        <Typography variant="h4" component="h4">
          {translate("inventory.pageDescription")}
        </Typography>
        <BasicTable rows={populatedInventories} />
      </div>
    </Layout>
  );
};
