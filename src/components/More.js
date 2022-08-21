import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Export from "./Export.js";
import Import from "./Import.js";
import Title from "./Title";

export default function ImportExport() {
  return (
    <React.Fragment>
      <Title>More</Title>
      <Container component={Paper} maxWidth="xs">
        <CssBaseline />
        <Import />
        <Export />
      </Container>
    </React.Fragment>
  );
}
