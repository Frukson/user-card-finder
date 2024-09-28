import React, { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchUsersReq } from "../../api/users";
import {
	StyledForm,
	StyledHeader,
	StyledNotFoundAnyWrapper,
	StyledProgressWrapper,
	Wrapper,
} from "./HomePageStyleds";
import FromTextField from "../../components/forms/FromTextField";
import AlignItemsList from "../../components/AlignItemList";
import { CircularProgress } from "@mui/material";
import { searchGithubUsersSchema } from "../../schemas/searchGithubUsersSchema";
import Typography from "@mui/material/Typography";

interface FormState {
	userName: string;
}
function HomePage() {
	const [searchingText, setSearchingText] = React.useState("");
	const methods = useForm<FormState>({
		mode: "onBlur",
		resolver: yupResolver(searchGithubUsersSchema),
	});
	const { handleSubmit } = methods;

	const { data, isPending, fetchNextPage, isFetchNextPageError } =
		useInfiniteQuery({
			initialPageParam: 0,
			queryKey: [searchingText],
			queryFn: ({ pageParam }) => fetchUsersReq(pageParam, searchingText),
			getNextPageParam: (lastPage, allPages) =>
				allPages.filter((p) => p.items).length + 1,
			enabled: !!searchingText,
		});

	const onSubmit = (formData: FormState) => {
		setSearchingText(formData.userName);
	};

	const debouncedFetchNextPage = useDebouncedCallback(() => {
		if (searchingText.length) {
			fetchNextPage();
		}
	}, 1500);

	const debounceSubmit = useDebouncedCallback(handleSubmit(onSubmit), 1500);

	const notFoundAnyUsers = useMemo(() => {
		return data?.pages.every((p) => p.total_count === 0);
	}, [data]);

	return (
		<Wrapper>
			<StyledHeader>Users github finder</StyledHeader>
			<FormProvider {...methods}>
				<StyledForm onChange={debounceSubmit}>
					<FromTextField
						name="userName"
						placeholder={"Type searching user ..."}
					/>
				</StyledForm>
			</FormProvider>
			{notFoundAnyUsers ? (
				<StyledNotFoundAnyWrapper>
					<Typography fontSize="25px" component="p" color="text.primary">
						User not found
					</Typography>
				</StyledNotFoundAnyWrapper>
			) : searchingText.length > 0 && isPending ? (
				<StyledProgressWrapper>
					<CircularProgress />
				</StyledProgressWrapper>
			) : (
				<AlignItemsList
					data={data}
					fetchNextPage={debouncedFetchNextPage}
					isFetchNextPageError={isFetchNextPageError}
				/>
			)}
		</Wrapper>
	);
}

export default HomePage;
