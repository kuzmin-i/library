import { Row, Col } from "antd";
import styled, { css } from "styled-components";

import breakpoints, {
  mediaXl,
  mediaLg,
  mediaMd,
  mediaSm,
} from "@/styles/theme/breakpoints";

const { sm, md, lg, xl } = breakpoints;

const narrowStyles = css`
  ${mediaXl} {
    max-width: ${lg}px;
  }

  ${mediaLg} {
    max-width: ${md}px;
  }

  ${mediaMd} {
    padding: 0 1.25rem;
    max-width: ${sm}px;
  }

  ${mediaSm} {
    max-width: 100%;
  }
`;

const Wrapper = styled(({ wide, ...rest }) => <Row {...rest} />)`
  margin: 0 auto;
  padding: ${({ wide }) => (wide ? 0 : "0 2.5rem")};
  max-width: ${({ wide }) => (wide ? "100%" : `${xl}px`)};
  width: 100%;
  ${({ wide }) => !wide && narrowStyles};
`;

export const PageContainer = styled.div`
  padding: 3rem 0 2rem;

  ${mediaSm} {
    padding: 2rem 0 2rem;
  }
`;

const Container = ({ className, wide, children }) => (
  <Wrapper {...{ className, wide }}>
    <Col span={24}>{children}</Col>
  </Wrapper>
);

export default Container;
