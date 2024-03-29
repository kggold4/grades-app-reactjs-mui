import React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { addGrade, clearGradesItems, validName, validGrade, validCredits } from "./GradesUtils";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import Title from "./Title";

function validInputs(name, grade, credits) {
  let errors = "";
  if(!validName(name)) errors += "Name of grade is not valid\n";
  if(!validGrade(grade)) errors += "Grade is not valid, need to by between 0 and 100\n";
  if(!validCredits(credits)) errors += "Credits points not valid, need to be grater or equal to 0";
  if(errors === "") {
    return true;
  } else {
    console.log(errors);
    return false;
  }
}

export default function Inset() {
  const [name, setName] = useState(" ");
  const [grade, setGrade] = useState(0);
  const [credits, setCredits] = useState(1);
  const [valid_name, setValidName] = useState(2);
  const [valid_grade, setValidGrade] = useState(3);
  const [valid_credits, setValidCredits] = useState(4);

  return (
    <React.Fragment>
      <Title>Add Grades</Title>
      <Container component={Paper} maxWidth="xs">
        <CssBaseline />
        <Box noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                name="grade"
                required
                fullWidth
                id="grade"
                label="Grade"
                autoFocus
                onChange={(e) => setGrade(e.target.value)}
              />
              {/* { valid_grade && (<Alert variant="outlined" severity="error">
                Grade not valid
              </Alert>)} */}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                fullWidth
                id="credits"
                label="Credits"
                name="credits"
                defaultValue="1"
                onChange={(e) => setCredits(e.target.value)}
              />
              {/* { valid_credits && (<Alert variant="outlined" severity="error">
                Credits points not valid
              </Alert>)} */}
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                id="courseName"
                label="Course Name"
                name="courseName"
              />
              {/* { valid_name && (<Alert variant="outlined" severity="error">
                Course Name no valid
              </Alert>)} */}
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ mt: 3, mb: 2 }}
                onClick={() => {
                  if(validInputs(name, parseFloat(grade), parseFloat(credits))) {
                    addGrade(name, parseFloat(grade), parseFloat(credits));
                  }
                }}
              >
                Add
              </Button>
              {/* <Alert variant="outlined" severity="error">
                Course Name no valid
              </Alert> */}
            </Grid>
            <Grid item xs={6}>
              <Button
                type="button"
                fullWidth
                variant="outlined"
                startIcon={<ClearIcon />}
                sx={{ mt: 3, mb: 2 }}
                onClick={() => {
                  clearGradesItems();
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  );
}
