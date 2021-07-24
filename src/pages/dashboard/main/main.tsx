import React, { FunctionComponent } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router-dom";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: "90vh",
  },
  appBar: {
    flexGrow: 1,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    marginLeft: 140,
    [theme.breakpoints.down("sm")]: {
      margin: 0,
    },
  },
  tab: {
    borderBottom: "1px #ccc solid",
  },
  footer: {
    height: 70,
  },
}));

export interface MainProps extends RouteComponentProps {}

export const Main: FunctionComponent<MainProps> = ({ history }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [translate] = useTranslation("common");

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    history.push("/");
  };

  return (
    <>
      <div className={classes.appBar}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              D/q Storehouse
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              {translate("dashboard.main.appBar.logout")}
            </Button>
          </Toolbar>
        </AppBar>
      </div>
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          <Tab
            label={translate("dashboard.main.tab.company")}
            {...a11yProps(0)}
            className={classes.tab}
          />
          <Tab
            label={translate("dashboard.main.tab.inventories")}
            {...a11yProps(1)}
            className={classes.tab}
          />
          <Tab
            label={translate("dashboard.main.tab.categories")}
            {...a11yProps(2)}
            className={classes.tab}
          />
          <Tab
            label={translate("dashboard.main.tab.products")}
            {...a11yProps(3)}
            className={classes.tab}
          />
        </Tabs>
        <TabPanel value={value} index={0}>
          Company
        </TabPanel>
        <TabPanel value={value} index={1}>
          Inventories
        </TabPanel>
        <TabPanel value={value} index={2}>
          Categories
        </TabPanel>
        <TabPanel value={value} index={3}>
          Products
        </TabPanel>
      </div>
      <div className={classes.appBar}>
        <AppBar position="static" component="footer" className={classes.footer}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Digital Quark Solutions
            </Typography>
            {/* <Button color="inherit">Logout</Button> */}
          </Toolbar>
        </AppBar>
      </div>
    </>
  );
};
