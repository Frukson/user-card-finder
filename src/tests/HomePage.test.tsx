import React, { act } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import HomePage from "../pages/homePage/HomePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";

// Setup QueryClient
const queryClient = new QueryClient();

// Helps to handle debounce in tests.
jest.useFakeTimers();

// Handlers for mocking API responses
const handlers = [
	http.get("https://api.github.com/search/users", ({ request }) => {
		const url = new URL(request.url);
		const userName = url.searchParams.get("q");

		// Mock response when user is not found
		if (userName === "userNotFound") {
			return HttpResponse.json({
				total_count: 0,
				incomplete_results: false,
				items: [],
			});
		}

		// Mock response when users are found
		if (userName === "konrad") {
			return HttpResponse.json({
				total_count: 3,
				incomplete_results: false,
				items: [
					{ login: "konrad", avatar_url: "https://example.com/avatar1.jpg" },
					{ login: "konradd", avatar_url: "https://example.com/avatar2.jpg" },
					{ login: "konraddd", avatar_url: "https://example.com/avatar3.jpg" },
				],
			});
		}
	}),
];

// Setup server for MSW
const server = setupServer(...handlers);

// Wrap the component with QueryClientProvider
const Wrapper = ({ children }: { children: any }) => {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe("GIVEN [HomePage] is initialized", () => {
	beforeAll(() => {
		global.IntersectionObserver = class {
			observe() {}
			unobserve() {}
			disconnect() {}
		} as unknown as typeof IntersectionObserver;
		server.listen();
	});

	afterEach(() => {
		server.resetHandlers();
		queryClient.clear(); // Clear QueryClient after each test
	});

	afterAll(() => server.close());

	it("THEN should render the title and input field", () => {
		render(
			<Wrapper>
				<HomePage />
			</Wrapper>,
		);

		expect(screen.getByText("Users github finder")).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText("Type searching user ..."),
		).toBeInTheDocument();
	});

	it("THEN writing 2 letters should show a validation error, and 3 letters should remove the validation error", async () => {
		render(
			<Wrapper>
				<HomePage />
			</Wrapper>,
		);

		const input = screen.getByPlaceholderText("Type searching user ...");

		// Type 2 letters (should trigger validation error)
		userEvent.type(input, "ab");

		// Wait for onSubmit debounce
		act(() => {
			jest.advanceTimersByTime(1500);
		});

		await waitFor(() => {
			expect(
				screen.getByText("Minimum 3 characters required"),
			).toBeInTheDocument();
		});

		// Type 3 letters (should remove validation error)
		userEvent.type(input, "kkk");
		await waitFor(() => {
			expect(
				screen.queryByText("Minimum 3 characters required"),
			).not.toBeInTheDocument();
		});
	});

	it("THEN entering 'userNotFound' should display 'User not found'", async () => {
		render(
			<Wrapper>
				<HomePage />
			</Wrapper>,
		);

		// Type 'userNotFound' to trigger mock API response
		userEvent.type(
			screen.getByPlaceholderText("Type searching user ..."),
			"userNotFound",
		);

		// Wait for onSubmit debounce
		act(() => {
			jest.advanceTimersByTime(1500);
		});

		// Assert that the 'User not found' message is displayed
		await waitFor(() => {
			expect(screen.getByText("User not found")).toBeInTheDocument();
		});
	});

	it("THEN entering 'konrad' should display 3 users", async () => {
		render(
			<Wrapper>
				<HomePage />
			</Wrapper>,
		);

		// Type 'konrad' to trigger mock API response
		userEvent.type(
			screen.getByPlaceholderText("Type searching user ..."),
			"konrad",
		);

		// Wait for onSubmit debounce
		act(() => {
			jest.advanceTimersByTime(1500);
		});

		// Wait for the 3 users to be displayed
		await waitFor(() => {
			const usersWrapper = screen.getAllByTestId("user-wrapper");
			expect(usersWrapper).toHaveLength(3);
		});
	});
});
