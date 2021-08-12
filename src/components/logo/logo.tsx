import React, { FunctionComponent } from "react";

import Typography from "@material-ui/core/Typography";
import StoreIcon from "@material-ui/icons/Store";
import { ReactComponent as LogoSvg } from "../../assets/Mark.svg";

import { LogoProps } from "./logo-props.interface";

export const Logo: FunctionComponent<LogoProps> = ({ variant }) => (
  <div style={{ width: "100%" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        width: "100%",
      }}
    >
      <LogoSvg fontSize="inherit" width={150} height={"auto"} />
    </div>
    <Typography variant={variant} style={{ textAlign: "center" }}>
      D/q Storehouse
    </Typography>
  </div>
);
