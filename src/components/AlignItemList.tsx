import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Box, css, Skeleton, styled } from "@mui/material";
import { Data } from "../api/users";
import { InfiniteData } from "@tanstack/react-query";
import { useMemo } from "react";
import useFetchOnInView from "../hooks/useFetchOnInView";

export const Wrapper = styled(List)(
	({ theme }) => css`
		width: 100%;
		height: auto;
		overflow: auto;
		background-color: ${theme.palette.background.paper};
		&::-webkit-scrollbar {
			width: 6px;
		}
		&::-webkit-scrollbar-thumb {
			background-color: ${theme.palette.secondary.main};
			border-radius: 10px;
		}

		${theme.breakpoints.up("md")} {
			height: 65%;
		}
		${theme.breakpoints.up("xl")} {
			height: 50%;
		}
	`,
);
const StyledListItem = styled(ListItem)(
	() => css`
		align-items: center;
		justify-items: flex-start;
	`,
);

const StyledSkeletonWrapper = styled(Box)(
	() => css`
		width: auto;
		height: 80px;
		display: flex;
		justify-items: center;
		align-items: center;
		gap: 20px;
	`,
);

const StyledFetchNextErrorWrapper = styled(Box)(
	() => css`
		width: auto;
		height: 80px;
		display: flex;
		justify-content: center;
		align-items: center;
	`,
);

export default function AlignItemsList({
	data,
	fetchNextPage,
	isFetchNextPageError,
}: {
	data: InfiniteData<Data, unknown> | undefined;
	fetchNextPage: () => void;
	isFetchNextPageError: boolean;
}) {
	const ref = useFetchOnInView(fetchNextPage);

	const filteredData = useMemo(
		() => data?.pages.filter((p) => p.items),
		[data],
	);

	return (
		<Wrapper>
			{filteredData?.map((i) =>
				i.items.map((i) => {
					return (
						<React.Fragment key={i.login}>
							<StyledListItem>
								<ListItemAvatar>
									<Avatar alt={`avatar-${i.login}`} src={i.avatar_url} />
								</ListItemAvatar>
								<Typography component="p" color="text.primary">
									{i.login}
								</Typography>
							</StyledListItem>
							<Divider variant="inset" component="li" />
						</React.Fragment>
					);
				}),
			)}
			{filteredData?.length &&
				!isFetchNextPageError &&
				filteredData[filteredData.length - 1].items.length !== 0 && (
					<StyledSkeletonWrapper>
						<StyledListItem>
							<ListItemAvatar>
								<Skeleton variant="circular" width={40} height={40} />
							</ListItemAvatar>
							<Skeleton variant="rectangular" width={160} height={24} />
						</StyledListItem>
						<Divider variant="inset" component="li" />
					</StyledSkeletonWrapper>
				)}

			{!isFetchNextPageError ? (
				<div ref={ref} />
			) : (
				<StyledFetchNextErrorWrapper>
					<Typography fontSize="25px" component="p" color="red">
						Failed to load users
					</Typography>
				</StyledFetchNextErrorWrapper>
			)}
		</Wrapper>
	);
}
