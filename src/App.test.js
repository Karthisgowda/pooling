import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders cab sharing dashboard", () => {
  render(<App />);
  expect(screen.getByText(/share routes, split fares/i)).toBeInTheDocument();
  expect(screen.getByText(/create a trip/i)).toBeInTheDocument();
});
