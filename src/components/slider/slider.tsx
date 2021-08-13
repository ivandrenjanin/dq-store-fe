import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import OutlinedInput from "@material-ui/core/OutlinedInput";

const useStyles = makeStyles({
  root: {
    // width: 250,
  },
  input: {
    width: 70,
  },
});

export const InputSlider = (props: any) => {
  const classes = useStyles();
  const [value, setValue] = React.useState<
    number | string | Array<number | string>
  >(1);

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    setValue(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > props.max) {
      setValue(props.max);
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            {...props}
            value={typeof value === "number" ? value : 1}
            onChange={handleSliderChange}
          />
        </Grid>
        <Grid item style={{ height: 69 }}>
          <OutlinedInput
            className={classes.input}
            value={value}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 1,
              min: 1,
              max: props.max,
              type: "number",
              "aria-labelledby": "input-slider",
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};
