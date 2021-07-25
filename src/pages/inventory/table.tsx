import React, { FunctionComponent } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { InventoryByIdResponse } from "../../api";
import { Button } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  root: {
    marginTop: 25,
  },
  table: {
    minWidth: 650,
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
});

interface BasicTableProps {
  rows: InventoryByIdResponse[];
}

export const BasicTable: FunctionComponent<BasicTableProps> = ({ rows }) => {
  const classes = useStyles();
  const [translate] = useTranslation("common");

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{translate("inventory.inventoryTable.name")}</TableCell>
            <TableCell align="right">
              {translate("inventory.inventoryTable.products")}
            </TableCell>
            <TableCell align="right">
              {translate("inventory.inventoryTable.categories")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <TableRow key={row.publicId}>
                <TableCell component="th" scope="row">
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ArrowForwardIcon />}
                  >
                    <Link to={`/inventory/${row.id}`} className={classes.link}>
                      {translate("inventory.inventoryTable.button.enter")}{" "}
                      {row.name}
                    </Link>
                  </Button>
                </TableCell>
                <TableCell align="right">{row.products.length}</TableCell>
                <TableCell align="right">{row.categories.length}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell component="th" scope="row">
                {translate("inventory.inventoryTable.empty")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
