import React from "react";
import { Box, css, FormHelperText, styled, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

const StyledWrapper = styled(Box)(
	({ theme }) => css`
		min-height: 90px;
		width: 100%;
		margin-bottom: 0.2rem;
	`,
);

const StyledField = styled(TextField)(({ theme }) => ({
	width: "100%",
	"& .MuiInputLabel-root": {
		color: theme.palette.secondary.main,
	},
}));

const StyledHelperText = styled(FormHelperText)(
	({ theme }) => css`
		color: red;
		font-size: 1rem;
		padding-left: 0.5rem;
	`,
);

const FromTextField = ({
	type = "text",
	name,
	variant = "outlined",
	placeholder,
}: {
	type?: "text" | "number";
	name: string;
	variant?: "outlined" | "filled" | "standard";
	placeholder?: string;
}) => {
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
				FormHelperTextProps={{ component: StyledHelperText }}
				key={name}
			/>
			<StyledHelperText>
				{errors[name]?.message ? String(errors[name]?.message) : ""}
			</StyledHelperText>
		</StyledWrapper>
	);
};
export default FromTextField;
