import * as React from "react";
import Typography from "@mui/material/Typography";
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

  console.log("minGrade: ", minGrade);
  console.log("maxGrade: ", maxGrade);
  console.log("sumCredits: ", sumCredits);
  console.log("average: ", average);
  return (
    <React.Fragment>
      <Title>Summary</Title>
      <Typography component="p" variant="h4">
        Average: {average}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        sumCredits: {sumCredits}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        maxGrade: {maxGrade}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        average: {average}
      </Typography>
    </React.Fragment>
  );
}
