import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Title from "./Title";

import {
  getMinGrade,
  getMaxGrade,
  getSumCredits,
  getAverage,
} from "./GradesUtils";

export default function Summary() {
  const minGrade = getMinGrade();
  const maxGrade = getMaxGrade();
  const sumCredits = getSumCredits();
  const average = getAverage();

  return (
    <React.Fragment>
      <Title>Summary</Title>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography component="p" variant="h6" paddingBottom={2.5}>
            Average: {average}
          </Typography>
        </Grid>
        <Grid item xs={3} sm={6}>
          <Typography color="text.secondary">
            Number of Credits: {sumCredits}
          </Typography>
        </Grid>
        <Grid item xs={3} sm={6}>
          <Typography color="text.secondary">
            Highest Grade: {maxGrade}
          </Typography>
        </Grid>
        <Grid item xs={3} sm={6}>
          <Typography color="text.secondary">
            Lowest Grade: {minGrade}
          </Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
