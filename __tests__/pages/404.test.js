import { render, screen } from "@testing-library/react";

import Error from "@/pages/404";

describe("Error", () => {
  it("renders without crashing", () => {
    render(<Error />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });
});
