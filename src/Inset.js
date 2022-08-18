import * as React from "react"
import { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();
let gradeItems = [];
let current_grade_id = 0;

function add_grade(name, grade, credits) {
  console.log(
    "add_grade: name: ",
    name,
    ", grade: ",
    grade,
    ", credits: ",
    credits
  );
  getCurrentGradeId();
  getCurrentGradeList();
  let gradeItem = new GradeItem(current_grade_id, name, grade, credits);
  gradeItems.push(gradeItem);
  setCurrentGradeItems();
  setCurrentGradeId();
  reloadGradeList();
}

function reloadGradeList() {
  window.location.reload(false);
}

function getCurrentGradeList() {
  let current_grades_list = JSON.parse(localStorage.getItem("gradeItems"));
  if(current_grades_list != null) {
    gradeItems = current_grades_list;
  }
}

function getCurrentGradeId() {
  current_grade_id = JSON.parse(localStorage.getItem("gradeID"));
  console.log("get id: ", current_grade_id);
  if(current_grade_id == null) {
    current_grade_id = 0;
  }
}

function setCurrentGradeId() {
  localStorage.setItem("gradeID", JSON.stringify(current_grade_id));
  console.log("save id: ", current_grade_id);
}

function setCurrentGradeItems() {
  current_grade_id++;
  localStorage.setItem("gradeItems", JSON.stringify(gradeItems));
}

function clearGradesItems() {
  gradeItems = [];
  localStorage.removeItem("gradeItems");
  current_grade_id = 0;
  setCurrentGradeId();
  reloadGradeList();
}

class GradeItem {
  constructor(id, name, grade, credits) {
    this.id = id;
    this.name = name;
    this.grade = grade;
    this.credits = credits;
  }
}

export default function Inset() {
  const [name, setName] = useState(" ");
  const [grade, setGrade] = useState(0);
  const [credits, setCredits] = useState(1);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Add Grade
          </Typography>
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                  id="courseName"
                  label="course Name"
                  name="courseName"
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {
                add_grade(name, parseFloat(grade), parseFloat(credits));
              }}
            >
              Add
            </Button>
            </Grid>
            <Grid item xs={6}>
            <Button
            type="button"
            fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {
                clearGradesItems();
              }}
            >Clear</Button>
            </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
