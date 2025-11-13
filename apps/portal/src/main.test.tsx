import { it, expect } from "vitest";
import { render, screen, waitFor } from "./test/test-utils";
import App from "./App";

it("mounts app to #root without crashing", async () => {
  render(<App />);

  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: /expand all/i })
    ).toBeInTheDocument();
  });
});
