import styled from "styled-components";
import { Card, Col, Divider, Grid, List, Row, Skeleton, Space } from "antd";

import Container from "@/components/layout/container";
import { SearchContainer } from "@/components/books-catalog/search-bar";
import { mediaSm } from "@/styles/theme/breakpoints";
import { useRouter } from "next/router";
import { BooksContainer } from "@/pages/account";

const { useBreakpoint } = Grid;

const Wrapper = styled.div`
  .ant {
    &-space,
    &-space-horizontal .ant-space-item:first-child,
    &-skeleton,
    &-list .ant-skeleton-button {
      width: 100%;
    }
  }
`;
const LoadingContainer = styled(Container)`
  padding-top: 2rem;
  padding-bottom: 2rem;
`;
const LoadingCard = styled(Card)`
  padding: 0;
  width: 100%;

  ${BooksContainer} & {
    display: flex;
    padding: 1rem;

    .ant-card-body {
      width: 100%;
      padding: 0 1rem;
    }
  }

  ${mediaSm} {
    display: flex;
    margin-bottom: 2rem;
  }

  .ant-card-body {
    padding: 1rem 0;

    ${mediaSm} {
      width: 100%;
      padding: 0 1rem;
    }
  }
`;
const LoadingTitle = styled(Skeleton)`
  .ant-skeleton-title {
    height: 1.5rem;
  }
`;

export const SkeletonCard = () => (
  <LoadingCard cover={<Skeleton.Image />} bordered={false} loading />
);

const SkeletonTitle = () => (
  <Row>
    <Col span={24} md={12} lg={8}>
      <LoadingTitle paragraph={false} active />
    </Col>
  </Row>
);

const SkeletonBookImage = styled(Skeleton.Image)`
  .ant-skeleton-image {
    position: relative;
    width: 100%;
    padding-top: 100%;

    &-svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;

const PageLoading = () => {
  const { pathname } = useRouter();
  const { md = true, lg = true } = useBreakpoint();
  const book = pathname?.includes("book");
  const rules = pathname?.includes("rules");
  const account = pathname?.includes("account");
  const admin = pathname?.includes("admin");

  return (
    <Wrapper>
      {!rules && !account && !admin && (
        <SearchContainer wide>
          <Container>
            <Space size={16}>
              <Skeleton.Input active />
              <Skeleton.Button active />
            </Space>
          </Container>
        </SearchContainer>
      )}
      <LoadingContainer>
        {admin ? (
          <></>
        ) : book ? (
          <Space direction="vertical" size={0}>
            <Skeleton title={{ width: 128 }} paragraph={false} />
            <Divider style={{ borderTopWidth: "0.125rem" }} />
            <Row gutter={[32, 32]}>
              <Col span={24} md={8}>
                <SkeletonBookImage />
              </Col>
              <Col span={24} md={16}>
                <Space direction="vertical" size={16}>
                  <SkeletonTitle />
                  <Skeleton active />
                </Space>
              </Col>
            </Row>
          </Space>
        ) : rules ? (
          <Space direction="vertical" size={32}>
            <SkeletonTitle />
            <Row>
              <Col span={24} lg={16}>
                <Skeleton title={false} paragraph={{ rows: 12 }} />
              </Col>
            </Row>
          </Space>
        ) : account ? (
          <Space direction="vertical" size={24}>
            <SkeletonTitle />
            <BooksContainer>
              <Space direction="vertical" size={16}>
                <Skeleton
                  title={{ width: 160, style: { margin: 0 } }}
                  paragraph={false}
                />
                <List
                  dataSource={Array(1).fill("")}
                  grid={{ gutter: 24, column: 3, xs: 1, sm: 2, md: 2 }}
                  renderItem={() => (
                    <List.Item>
                      <SkeletonCard />
                    </List.Item>
                  )}
                />
              </Space>
            </BooksContainer>
            <BooksContainer>
              <Space direction="vertical" size={16}>
                <Skeleton
                  title={{ width: 160, style: { margin: 0 } }}
                  paragraph={false}
                />
                <List
                  dataSource={Array(3).fill("")}
                  grid={{ gutter: 24, column: 3, xs: 1, sm: 2, md: 2 }}
                  renderItem={() => (
                    <List.Item>
                      <SkeletonCard />
                    </List.Item>
                  )}
                />
              </Space>
            </BooksContainer>
          </Space>
        ) : (
          <Space direction="vertical" size={48}>
            <SkeletonTitle />
            <List
              dataSource={Array(lg ? 8 : md ? 6 : 4).fill("")}
              grid={{ gutter: 24, column: 4, xs: 1, sm: 2, md: 3 }}
              renderItem={() => (
                <List.Item>
                  <SkeletonCard />
                </List.Item>
              )}
            />
          </Space>
        )}
      </LoadingContainer>
    </Wrapper>
  );
};

export default PageLoading;
