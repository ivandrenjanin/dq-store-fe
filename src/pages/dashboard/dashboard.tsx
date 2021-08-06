import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

import { DashboardProps } from "./interfaces/dashboard-props.interface";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  })
);

export const Dashboard: FunctionComponent<DashboardProps> = ({ apiClient }) => {
  const [translate] = useTranslation("common");
  const classes = useStyles();

  return (
    <>
      <div className={classes.root}>
        <Typography variant="h4" component="h4">
          {translate("dashboard.pageDescription")}
        </Typography>
      </div>
    </>
  );
};
