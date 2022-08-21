import React from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { saveToCsvFile } from "./GradesUtils";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function Export() {
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (agree) => {
    setOpen(false);
    if (agree) {
      saveToCsvFile();
    }
  };

  return (
    <Box>
      <Button
        type="button"
        fullWidth
        variant="outlined"
        startIcon={<FileDownloadIcon />}
        sx={{ mt: 3, mb: 2 }}
        onClick={() => {
          handleClickOpen();
        }}
      >
        Export
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Export the grades list to a csv file?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            By agreeing this dialog the app will download a csv file with your
            list of grades.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              handleClose(false);
            }}
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              handleClose(true);
            }}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
