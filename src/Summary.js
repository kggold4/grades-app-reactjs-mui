import * as React from "react"
import Card from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

export default function Summary() {
    return (
        <ThemeProvider theme={theme}>
        <Card variant="outlined">Card</Card>
        </ThemeProvider>
    )
}
