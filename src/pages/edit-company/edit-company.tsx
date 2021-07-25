import { AxiosInstance } from "axios";
import { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, RouteComponentProps } from "react-router-dom";

import { Input } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import SaveIcon from "@material-ui/icons/Save";

import { CompanyResponse, getCompany, updateCompany } from "../../api/company";
import { Layout } from "../../components/layout/layout";

export interface EditCompanyProps extends RouteComponentProps {
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
    listValue: {
      backgroundColor: "white!important",
    },
    button: {
      marginTop: 25,
      marginRight: 15,
    },
  })
);

export const EditCompany: FunctionComponent<EditCompanyProps> = ({
  history,
  location,
  match,
  apiClient,
}) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: any = {};
    for (const el of e.currentTarget.elements) {
      const element = el as HTMLInputElement;
      if (element.nodeName === "INPUT") {
        data[element.name] = element.value;
      }
    }

    const updated = await updateCompany(apiClient, company?.id as number, data);
    setCompany(updated);
    history.push("/company");
  };

  return (
    <Layout history={history} location={location} match={match}>
      {!company ? (
        <CircularProgress />
      ) : (
        <form className={classes.root} onSubmit={handleSubmit}>
          <Typography variant="h4" component="h4">
            {translate("company.pageDescription")}
          </Typography>

          <div className={classes.list}>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.name`)}:
              </span>
              <Input
                name="name"
                className={classes.listValue}
                defaultValue={company.name}
              />
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.websiteURL`)}:
              </span>
              <Input
                name="websiteURL"
                className={classes.listValue}
                defaultValue={company.websiteURL}
              />
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.email`)}:
              </span>
              <Input
                name="email"
                className={classes.listValue}
                defaultValue={company.email}
              />
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.phoneFaxNumber`)}:
              </span>
              <Input
                name="phoneFaxNumber"
                className={classes.listValue}
                defaultValue={company.phoneFaxNumber}
              />
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.phoneMobileNumber`)}:
              </span>
              <Input
                name="phoneMobileNumber"
                className={classes.listValue}
                defaultValue={company.phoneMobileNumber}
              />
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.postalCode`)}:
              </span>
              <Input
                name="postalCode"
                className={classes.listValue}
                defaultValue={company.postalCode}
              />
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.taxIdNumber`)}:
              </span>
              <Input
                name="taxIdNumber"
                className={classes.listValue}
                defaultValue={company.taxIdNumber}
              />
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.companyNumber`)}:
              </span>
              <Input
                name="companyNumber"
                className={classes.listValue}
                defaultValue={company.companyNumber}
              />
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.activityCode`)}:
              </span>
              <Input
                name="activityCode"
                className={classes.listValue}
                defaultValue={company.activityCode}
              />
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.bankName`)}:
              </span>
              <Input
                name="bankName"
                className={classes.listValue}
                defaultValue={company.bankName}
              />
            </Box>
            <Box component="div">
              <span className={classes.listHeader}>
                {translate(`company.bankAccountNumber`)}:
              </span>
              <Input
                name="bankAccountNumber"
                className={classes.listValue}
                defaultValue={company.bankAccountNumber}
              />
            </Box>
          </div>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
          >
            <Link to={"/company"} className={classes.link}>
              {translate("company.button.back")}
            </Link>
          </Button>
          <Button
            className={classes.button}
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
          >
            {translate("company.button.save")}
          </Button>
        </form>
      )}
    </Layout>
  );
};
