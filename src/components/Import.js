import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import UploadIcon from "@mui/icons-material/Upload";
import Typography from "@mui/material/Typography";
import { setGradesFromFile } from "./GradesUtils";

export default function Import() {
  const [file, setFile] = React.useState();
  const [fileName, setFileName] = React.useState("");
  const [showUpload, setShowUpload] = React.useState(true);
  const [showImportBtn, setShowImportBtn] = React.useState(false);

  const fileReader = new FileReader();

  const handleOnDeleteUploadedFile = (e) => {
    setFileName("");
    setFile(null);
    setShowUpload(true);
    setShowImportBtn(false);
  };

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setShowUpload(false);
      setShowImportBtn(true);
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (file) {
      fileReader.onload = function(event) {
        const csvOutput = event.target.result;
        setGradesFromFile(csvOutput);
      };
      fileReader.readAsText(file);
    }
  };

  return (
    <form>
      {showUpload && (
        <label id="insert-csv" htmlFor="upload-csv">
          <input
            style={{ display: "none" }}
            id="upload-csv"
            name="upload-csv"
            type="file"
            accept={".csv"}
            onChange={handleOnChange}
          />

          <Button
            type="button"
            fullWidth
            startIcon={<UploadIcon />}
            component="span"
            aria-label="add"
            variant="outlined"
          >
            Import
          </Button>
        </label>
      )}
      {showImportBtn && (
        <Box>
          <Typography
            align="left"
            component="small"
            variant="small"
            gutterBottom
          >
            <Button
              type="button"
              onClick={(e) => {
                handleOnDeleteUploadedFile(e);
              }}
            >
              X
            </Button>
            {fileName}
          </Typography>
          <Button
            type="button"
            fullWidth
            color="secondary"
            variant="outlined"
            startIcon={<UploadIcon />}
            component="label"
            sx={{ mt: 3, mb: 2 }}
            onClick={(e) => {
              handleOnSubmit(e);
            }}
          >
            Import File
          </Button>
        </Box>
      )}
    </form>
  );
}
