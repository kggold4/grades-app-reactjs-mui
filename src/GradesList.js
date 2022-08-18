import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function loadGrades() {
  let gradeItems = JSON.parse(localStorage.getItem('gradeItems'));
  if((gradeItems != null) && (gradeItems.length > 0)) {
    console.log("get: ", gradeItems);
    return gradeItems;
  } else {
    return [];
  }
}

export default function GradeList() {
  const gradeItems = loadGrades();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Course Name</TableCell>
            <TableCell align="right">Grade</TableCell>
            <TableCell align="right">Credits</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {gradeItems.map((gradeItem) => (
            <TableRow
              key={gradeItem.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
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
  );
}
