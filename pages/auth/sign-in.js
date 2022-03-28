import { useRouter } from "next/router";
import { signIn } from "next-auth/client";
import styled from "styled-components";
import { Button, Col, Row, Space, Typography } from "antd";
import Icon from "@ant-design/icons";

import GoogleIcon from "../../public/assets/icons/google.svg";
import Container from "@/components/layout/container";
import { NextSeo } from "next-seo";
import { getPageUrl, handleQueryArr } from "@/lib/helpers";
import { siteTitle } from "@/next-seo.config";
import { ogImageUrl } from "@/constants";

const { Title, Text } = Typography;

export const Wrapper = styled(Container)`
  flex-grow: 1;
  background-color: var(--color-grey);
`;

export const InnerContainer = styled(Container)`
  height: 100%;
  text-align: center;

  > .ant-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  h2.ant-typography,
  .ant-typography h2 {
    margin: 1rem 0;
  }

  .ant-btn {
    display: flex;

    .anticon {
      width: 1.5rem;
      height: 1.5rem;
      font-size: 1.5rem;
    }
  }
`;

const SignIn = () => {
  const { query } = useRouter();
  const { callbackUrl } = { ...query };
  const title = "Авторизация";
  const description =
    "Чтобы воспользоваться библиотекой, пожалуйста, авторизуйтесь через почтовый аккаунт КБ Стрелка";

  return (
    <Wrapper wide>
      <NextSeo
        {...{ title, description }}
        openGraph={{
          title,
          description,
          images: [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: siteTitle,
            },
          ],
          url: getPageUrl(),
        }}
      />
      <InnerContainer>
        <Space direction="vertical" align="center" size={32}>
          <Space direction="vertical" align="center">
            <Row align="center">
              <Col span={24}>
                <Title level={2}>{title}</Title>
              </Col>
            </Row>
            <Row align="center">
              <Col span={24} md={20} lg={16}>
                <Text>{description}</Text>
              </Col>
            </Row>
          </Space>
          <Row align="center">
            <Col span={24}>
              <Button
                icon={<Icon component={GoogleIcon} />}
                size="large"
                onClick={() =>
                  signIn("google", { callbackUrl: handleQueryArr(callbackUrl) })
                }
              >
                Войти с Google
              </Button>
            </Col>
          </Row>
        </Space>
      </InnerContainer>
    </Wrapper>
  );
};

export default SignIn;
