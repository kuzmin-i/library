import Link from "next/link";
import { NextSeo } from "next-seo";
import styled from "styled-components";
import { Result, Button } from "antd";

import { getPageUrl } from "@/lib/helpers";

const Container = styled(Result)`
  .ant-result-title {
    font-weight: 700;
  }
`;

const ErrorPage = ({ status = "warning", title, subTitle, extra, icon }) => (
  <>
    <NextSeo
      {...{ title }}
      description={subTitle || false}
      noindex={true}
      openGraph={{
        title,
        description: subTitle,
        url: getPageUrl(),
      }}
    />
    <Container
      {...{ status, title, subTitle, icon }}
      extra={
        extra || (
          <Link href="/" passHref>
            <Button type="primary">На главную</Button>
          </Link>
        )
      }
    />
  </>
);

export default ErrorPage;
