import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const useFetchOnInView = (fetchNextPage: () => void) => {
	const { ref, inView } = useInView();

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [fetchNextPage, inView]);

	return ref;
};

export default useFetchOnInView;
