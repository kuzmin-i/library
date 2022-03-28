import styled from "styled-components";
import { Spin } from "antd";

import { InnerContainer, Wrapper } from "@/pages/auth/sign-in";

const Loader = styled(Spin)`
  .ant-spin-text {
    padding-top: 1.5rem;
  }
`;

const PageRedirect = () => (
  <Wrapper wide>
    <InnerContainer>
      <Loader
        size="large"
        tip="Перенаправление на страницу авторизации..."
        spinning
      />
    </InnerContainer>
  </Wrapper>
);

export default PageRedirect;
