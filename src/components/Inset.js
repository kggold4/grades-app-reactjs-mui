import React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { addGrade, clearGradesItems } from "./GradesUtils";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import Title from "./Title";

export default function Inset() {
  const [name, setName] = useState(" ");
  const [grade, setGrade] = useState(0);
  const [credits, setCredits] = useState(1);

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
                startIcon={<AddIcon />}
                sx={{ mt: 3, mb: 2 }}
                onClick={() => {
                  addGrade(name, parseFloat(grade), parseFloat(credits));
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
