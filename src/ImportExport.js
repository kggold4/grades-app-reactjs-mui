import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import UploadIcon from "@mui/icons-material/Upload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Title from "./Title";

export default function ImportExport() {
  return (
    <React.Fragment>
      <Title>More</Title>
      <Container component={Paper} maxWidth="xs">
        <CssBaseline />
        <Button
          type="button"
          fullWidth
          variant="outlined"
          startIcon={<UploadIcon />}
          component="label"
          sx={{ mt: 3, mb: 2 }}
          onClick={() => {
            console.log("import");
          }}
        >
          <input type="file" hidden />
          Import
        </Button>
        <Button
          type="button"
          fullWidth
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          sx={{ mt: 3, mb: 2 }}
          onClick={() => {
            console.log("import");
          }}
        >
          Export
        </Button>
      </Container>
    </React.Fragment>
  );
}
