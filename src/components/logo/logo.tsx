import React, { FunctionComponent } from "react";
import Typography from "@material-ui/core/Typography";
import StoreIcon from "@material-ui/icons/Store";
import { LogoProps } from "./logo-props.interface";

export const Logo: FunctionComponent<LogoProps> = ({ variant }) => (
  <Typography variant={variant}>
    {<StoreIcon fontSize="inherit" />} D/q Storehouse
  </Typography>
);
