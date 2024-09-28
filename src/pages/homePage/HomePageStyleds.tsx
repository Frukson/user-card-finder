import { Box, Container, css, styled } from "@mui/material";
import Typography from "@mui/material/Typography";

export const Wrapper = styled(Container)(
	({ theme }) => css`
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		text-align: center;
		${theme.breakpoints.up("md")} {
			width: 70%;
		}
		${theme.breakpoints.up("xl")} {
			width: 40%;
		}
	`,
);
export const StyledForm = styled("form")(
	() => css`
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	`,
);

export const StyledProgressWrapper = styled(Box)(
	() => css`
		display: flex;
		height: 100%;
		align-items: center;
		justify-items: center;
	`,
);
export const StyledNotFoundAnyWrapper = styled(Box)(
	() => css`
		display: flex;
		height: 100%;
		align-items: flex-start;
	`,
);
export const StyledHeader = styled(Typography)(
	({ theme }) => css`
		margin: 32px 0;
		font-size: 27px;
		font-weight: bold;
		color: black;
		letter-spacing: 1px;
	`,
);
