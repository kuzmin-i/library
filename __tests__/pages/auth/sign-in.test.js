import renderer from "react-test-renderer";

import SignIn from "@/pages/auth/sign-in";

const route = "/auth/sign-in";

jest.mock("next/router", () => ({
  useRouter: () => ({
    route,
    pathname: route,
    query: {},
    asPath: route,
  }),
}));

describe("SignIn", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<SignIn />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
