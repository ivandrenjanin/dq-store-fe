import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { AxiosInstance } from "axios";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router-dom";

import { Layout } from "../../components/layout/layout";

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
}) => {
  const [translate] = useTranslation("common");
  const classes = useStyles();

  return (
    <Layout history={history} location={location} match={match}>
      <div className={classes.root}>
        <Typography variant="h4" component="h4">
          {translate("inventory.pageDescription")}
        </Typography>
      </div>
    </Layout>
  );
};
