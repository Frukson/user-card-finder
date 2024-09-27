import { createTheme } from "@mui/material";
import { TYPOGRAPHY } from "./typography";

const theme = createTheme({
	cssVariables: true,
	palette: {
		primary: {
			main: "#1c2120",
		},
		secondary: {
			main: "#feb06a",
		},
	},
	typography: TYPOGRAPHY,
});
export default theme;
