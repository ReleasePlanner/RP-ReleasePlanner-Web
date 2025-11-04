import { it, expect } from "vitest";
import { render, screen } from "./test/test-utils";
import App from "./App";

it("renders ReleasePlanner via routes", () => {
  render(<App />);
  expect(
    screen.getByRole("button", { name: /expand all/i })
  ).toBeInTheDocument();
});
