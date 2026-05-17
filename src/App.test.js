import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders cab sharing dashboard", () => {
  render(<App />);
  expect(screen.getByText(/share routes, split fares/i)).toBeInTheDocument();
  expect(screen.getByText(/create a trip/i)).toBeInTheDocument();
  expect(screen.getByText(/no rides published yet/i)).toBeInTheDocument();
  expect(screen.getByText(/ai ride assistant/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /clear filters/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/import rides json file/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /export rides json file/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /clear all/i })).toBeInTheDocument();
});
