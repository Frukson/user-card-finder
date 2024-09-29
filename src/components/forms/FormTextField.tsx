import React from "react";
import { Box, css, styled, TextField, useTheme } from "@mui/material";
import { useFormContext } from "react-hook-form";
import Typography from "@mui/material/Typography";

const StyledWrapper = styled(Box)(
	({ theme }) => css`
		min-height: 90px;
		width: 100%;
		margin-bottom: ${theme.spacing(0.5)};
	`,
);

const StyledField = styled(TextField)(
	({ theme }) => css`
		width: 100%;
		& .MuiInputLabel-root {
			color: ${theme.palette.secondary.main};
		}
	`,
);

interface FormTextFieldProps {
	type?: "text" | "number";
	name: string;
	variant?: "outlined" | "filled" | "standard";
	placeholder?: string;
}

const FormTextField = ({
	type = "text",
	name,
	variant = "outlined",
	placeholder,
}: FormTextFieldProps) => {
	const theme = useTheme();
	const {
		register,
		formState: { errors },
	} = useFormContext();

	return (
		<StyledWrapper>
			<StyledField
				{...register(name)}
				error={!!errors[name]}
				type={type}
				variant={variant}
				placeholder={placeholder}
				key={name}
			/>
			<Typography
				fontSize="16px"
				component="span"
				color={theme.palette.error.main}
			>
				{errors[name]?.message ? String(errors[name]?.message) : ""}
			</Typography>
		</StyledWrapper>
	);
};
export default FormTextField;
