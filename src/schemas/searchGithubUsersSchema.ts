import * as yup from "yup";

export const searchGithubUsersSchema = yup.object({
	userName: yup
		.string()
		.required("Field is required")
		.min(3, "Minimum 3 characters required")
		.max(20, "Maximum 20 characters allowed"),
});
