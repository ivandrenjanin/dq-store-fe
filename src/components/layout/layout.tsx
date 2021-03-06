import clsx from "clsx";
import { useSnackbar } from "notistack";
import React, { FunctionComponent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, RouteComponentProps } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DnsIcon from "@material-ui/icons/Dns";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MenuIcon from "@material-ui/icons/Menu";
import PeopleIcon from "@material-ui/icons/People";
import WorkIcon from "@material-ui/icons/Work";

import { ReactComponent as Logo } from "../../assets/Mark.svg";
import { useAppSelector } from "../../hooks/redux.hooks";
import { SnackbarState } from "../../reducers/snackbar.reducer";
import SplitButtonTranslate from "../split-button-translate/split-button-translate";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    nav: {
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    link: {
      textDecoration: "none",
      color: "inherit",
    },
    active: {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    inactive: {},
    btnGroup: {
      display: "flex",
      width: 300,
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
);

export interface LayoutProps extends RouteComponentProps {}

export const Layout: FunctionComponent<LayoutProps> = ({
  history,
  location,
  children,
}) => {
  const drawerOpen = localStorage.getItem("drawerOpen") === "true";
  const [open, setOpen] = React.useState(drawerOpen);
  const snackbarState = useAppSelector<SnackbarState>(
    (state) => state.snackbar
  );
  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();
  const theme = useTheme();
  const [translate] = useTranslation("common");

  useEffect(() => {
    if (snackbarState.variant !== "") {
      enqueueSnackbar(snackbarState.message, {
        variant: snackbarState.variant,
      });
    }
  }, [enqueueSnackbar, snackbarState]);

  const handleDrawerOpen = () => {
    localStorage.setItem("drawerOpen", "true");
    setOpen(true);
  };

  const handleDrawerClose = () => {
    localStorage.setItem("drawerOpen", "false");
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    history.push("/");
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        variant="outlined"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.nav}>
            <div style={{ display: "flex" }}>
              {/* <Logo style={{ width: 50, height: "auto" }} /> */}
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                D/q Storehouse
              </Typography>
            </div>
            {/* <div className={classes.btnGroup}> */}
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<ExitToAppIcon />}
            >
              {translate("layout.navigation.logout")}
            </Button>
            {/* <SplitButtonTranslate /> */}
            {/* </div> */}
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {/* <Link to="/dashboard" className={classes.link}>
            <ListItem
              button
              className={
                location.pathname.includes("/dashboard")
                  ? classes.active
                  : classes.inactive
              }
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText
                primary={translate("layout.navigation.dashboard")}
              />
            </ListItem>
          </Link> */}
          <Link to="/firma" className={classes.link}>
            <ListItem
              button
              className={
                location.pathname.includes("/firma")
                  ? classes.active
                  : classes.inactive
              }
            >
              <ListItemIcon>
                <WorkIcon />
              </ListItemIcon>
              <ListItemText primary={translate("layout.navigation.company")} />
            </ListItem>
          </Link>
          <Link to="/komitent" className={classes.link}>
            <ListItem
              button
              className={
                location.pathname.includes("komitent")
                  ? classes.active
                  : classes.inactive
              }
            >
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText
                primary={translate("layout.navigation.companyClient")}
              />
            </ListItem>
          </Link>
          <Link to="/magacin" className={classes.link}>
            <ListItem
              button
              className={
                location.pathname.includes("/magacin")
                  ? classes.active
                  : classes.inactive
              }
            >
              <ListItemIcon>
                <DnsIcon />
              </ListItemIcon>
              <ListItemText
                primary={translate("layout.navigation.inventory")}
              />
              {/* {openList ? <ExpandLess /> : <ExpandMore />} */}
            </ListItem>
          </Link>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
};
