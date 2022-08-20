import * as React from "react";
import Title from "./Title";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getStatistics } from "./GradesUtils";

export default function Summary() {
  const statistics = getStatistics();
  console.table(statistics);

  return (
    <React.Fragment>
      <Title>Statistics</Title>
      <TableContainer component={Paper}>
        <Table sx={{ maxWidth: 275 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Grades Average</TableCell>
              <TableCell>Number of Credits</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statistics.map((statistics) => (
              <TableRow
                key={statistics.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{statistics.average}</TableCell>
                <TableCell>{statistics.sumCredits}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table sx={{ maxWidth: 275 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Highest Grade</TableCell>
              <TableCell>Lowest Grade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statistics.map((statistics) => (
              <TableRow
                key={statistics.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{statistics.maxGrade}</TableCell>
                <TableCell>{statistics.minGrade}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}
