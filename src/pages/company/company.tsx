import { AxiosInstance } from "axios";
import { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, RouteComponentProps } from "react-router-dom";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";

import { CompanyResponse, getCompany } from "../../api/company";

export interface CompanyProps extends RouteComponentProps {
  apiClient: AxiosInstance;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    list: {
      display: "flex",
      flexDirection: "column",
      paddingTop: 25,
      "& div": {
        display: "flex",
        flexDirection: "column",
        padding: 10,
      },
      "& div:nth-child(even)": {
        backgroundColor: "rgba(0,0,0, 0.1)",
      },
      "& div:nth-child(odd)": {
        backgroundColor: "rgba(0,0,0, 0.05)",
      },
    },
    link: {
      textDecoration: "none",
      color: "inherit",
    },
    listHeader: {
      fontWeight: "bold",
      marginRight: 5,
    },
    listValue: {},
    button: {
      marginTop: 25,
    },
  })
);

export const Company: FunctionComponent<CompanyProps> = ({ apiClient }) => {
  const classes = useStyles();
  const [translate] = useTranslation("common");
  const [company, setCompany] = useState<Partial<CompanyResponse> | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      const company = await getCompany(apiClient);
      setCompany(company);
    };

    fetchCompany();
  }, []);

  return (
    <>
      {!company ? (
        <CircularProgress />
      ) : (
        <div className={classes.root}>
          <Typography variant="h4" component="h4">
            {translate("company.pageDescription")}
          </Typography>

          <div className={classes.list}>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.name`)}:
              </span>
              <span className={classes.listValue}>{company.name}</span>
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.websiteURL`)}:
              </span>
              <span className={classes.listValue}>{company.websiteURL}</span>
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.email`)}:
              </span>
              <span className={classes.listValue}>{company.email}</span>
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.phoneFaxNumber`)}:
              </span>
              <span className={classes.listValue}>
                {company.phoneFaxNumber}
              </span>
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.phoneMobileNumber`)}:
              </span>
              <span className={classes.listValue}>
                {company.phoneMobileNumber}
              </span>
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.postalCode`)}:
              </span>
              <span className={classes.listValue}> {company.postalCode}</span>
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.taxIdNumber`)}:
              </span>
              <span className={classes.listValue}>{company.taxIdNumber}</span>
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.companyNumber`)}:
              </span>
              <span className={classes.listValue}>{company.companyNumber}</span>
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.activityCode`)}:
              </span>
              <span className={classes.listValue}>{company.activityCode}</span>
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.bankName`)}:
              </span>
              <span className={classes.listValue}>{company.bankName}</span>
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.bankAccountNumber`)}:
              </span>
              <span className={classes.listValue}>
                {company.bankAccountNumber}
              </span>
            </Box>
          </div>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
          >
            <Link to={`/company/${company.id}`} className={classes.link}>
              {translate("company.button.edit")}
            </Link>
          </Button>
        </div>
      )}
    </>
  );
};
