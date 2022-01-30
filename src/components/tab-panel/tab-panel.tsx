import React from "react";

import Box from "@material-ui/core/Box";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

export const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ padding: 0 }}
      {...other}
    >
      {value === index && (
        <Box p={3} style={{ padding: 0 }}>
          {children}
        </Box>
      )}
    </div>
  );
};
