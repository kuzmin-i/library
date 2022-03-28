import styled from "styled-components";
import { Col, Row, Typography } from "antd";

import Container, { PageContainer } from "@/components/layout/container";
import { animatedLink } from "@/styles/theme/global-style";

const { Paragraph, Title } = Typography;

const Wrapper = styled(Container)`
  ${animatedLink}

  .ant {
    &-alert-message {
      font-weight: 700;
    }

    &-space {
      width: 100%;
    }
  }
`;

const RulesLayout = ({ title, children }) => (
  <PageContainer>
    <Wrapper>
      {title && (
        <Row>
          <Col span={24}>
            <Title level={2}>{title}</Title>
          </Col>
        </Row>
      )}
      <Row>
        <Col span={24} md={20} lg={16}>
          <Paragraph>{children}</Paragraph>
        </Col>
      </Row>
    </Wrapper>
  </PageContainer>
);

export default RulesLayout;
