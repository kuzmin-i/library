import styled from "styled-components";
import { Typography } from "antd";

const { Text } = { ...Typography };

const Key = styled(({ large, ...props }) => <Text {...props} />)`
  padding-top: ${({ large }) => large && "0.375rem"};
  font-family: var(--font-fugue);
  font-weight: bold;
  font-size: ${({ large }) => (large ? "1.5rem" : "1.25rem")};
  line-height: 1;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export default Key;
