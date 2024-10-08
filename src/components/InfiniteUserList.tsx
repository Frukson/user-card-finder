import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Box, css, Skeleton, styled } from "@mui/material";
import { UsersData } from "../api/users";
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

const StyledFetchNextErrorWrapper = styled(Box)(
	() => css`
		width: auto;
		height: 80px;
		display: flex;
		justify-content: center;
		align-items: center;
	`,
);

const StyledSkeletonWrapper = styled(StyledFetchNextErrorWrapper)(
	({ theme }) => css`
		gap: ${theme.spacing(2.5)};
	`,
);

const ListItemComponent = ({ item }: { item: UsersData["items"][number] }) => (
	<StyledListItem data-testid="user-wrapper">
		<ListItemAvatar>
			<Avatar alt={`avatar-${item.login}`} src={item.avatar_url} />
		</ListItemAvatar>
		<Typography component="p" color="text.primary">
			{item.login}
		</Typography>
	</StyledListItem>
);

const SkeletonComponent = () => (
	<StyledSkeletonWrapper>
		<StyledListItem>
			<ListItemAvatar>
				<Skeleton variant="circular" width={40} height={40} />
			</ListItemAvatar>
			<Skeleton variant="rectangular" width={160} height={24} />
		</StyledListItem>
		<Divider variant="inset" component="li" />
	</StyledSkeletonWrapper>
);

const ErrorComponent = () => (
	<StyledFetchNextErrorWrapper>
		<Typography fontSize="25px" component="p" color="red">
			Failed to load users
		</Typography>
	</StyledFetchNextErrorWrapper>
);

export default function InfiniteUserList({
	data,
	fetchNextPage,
	isFetchNextPageError,
}: {
	data: InfiniteData<UsersData, unknown> | undefined;
	fetchNextPage: () => void;
	isFetchNextPageError: boolean;
}) {
	const ref = useFetchOnInView(fetchNextPage);

	const filteredData = useMemo(
		() => data?.pages.filter((p) => p.items),
		[data],
	);

	const showSkeleton =
		filteredData?.length &&
		!isFetchNextPageError &&
		filteredData[filteredData.length - 1].items.length !== 0;
	return (
		<Wrapper>
			{filteredData?.map((i) =>
				i.items.map((i) => {
					return (
						<React.Fragment key={i.login}>
							<ListItemComponent item={i} />
							<Divider variant="inset" component="li" />
						</React.Fragment>
					);
				}),
			)}
			{showSkeleton && <SkeletonComponent />}

			{!isFetchNextPageError ? <div ref={ref} /> : <ErrorComponent />}
		</Wrapper>
	);
}
