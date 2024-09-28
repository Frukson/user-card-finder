export interface UsersData {
	total_count: number;
	items: {
		login: string;
		avatar_url: string;
	}[];
	lastPageParam: number;
}
export const fetchUsersReq = async (
	pageParam: number,
	searchingText: string,
): Promise<UsersData> => {
	const res = await fetch(
		`https://api.github.com/search/users?q=${searchingText}&page=${pageParam}&per_page=12`,
		{
			headers: {
				Accept: "application/vnd.github.v3+json",
			},
		},
	);
	if (!res.ok) {
		throw new Error(`Error fetching data: ${res.statusText}`);
	}
	return res.json();
};
