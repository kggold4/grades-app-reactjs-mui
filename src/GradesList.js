import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { getCurrentGradeList } from "./GradesUtils";
import Title from "./Title";

export default function GradeList() {
  const gradeItems = getCurrentGradeList();

  return (
    <React.Fragment>
      <Title>Grades List</Title>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell align="right">Grade</TableCell>
              <TableCell align="right">Credits</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gradeItems.map((gradeItem) => (
              <TableRow
                key={gradeItem.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Button>X</Button>
                </TableCell>
                <TableCell component="th" scope="row">
                  {gradeItem.name}
                </TableCell>
                <TableCell align="right">{gradeItem.grade}</TableCell>
                <TableCell align="right">{gradeItem.credits}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}
