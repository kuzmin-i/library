import { cloneElement } from "react";
import Link from "next/link";
import { Empty, Grid, List, Typography } from "antd";
import styled from "styled-components";

import BookCard from "@/components/book/book-card";

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const BookList = styled(List)`
  .ant-list-pagination {
    text-align: center;
  }
`;

const BookListItem = styled(List.Item)`
  align-items: flex-start;
`;

const PageLink = ({ pathname = "", query, page, children }) => (
  <Link
    href={{
      pathname,
      query: { ...query, page },
    }}
  >
    {children}
  </Link>
);

const Catalog = ({
  dataSource,
  current,
  pageSize = 12,
  total = 0,
  grid = { gutter: 24, column: 4, xs: 1, sm: 2, md: 3 },
  query,
  pathname,
  component,
  userId,
  prefetchQuery,
  ...props
}) => {
  const { sm = true } = useBreakpoint();

  const Component = component || BookCard;
  const { slug, ...rest } = { ...query };
  const [, catalog] = slug || [];

  const calculatePage = () => Math.floor((total - 1) / pageSize) + 1;
  const hasPrev = () => current > 1;
  const hasNext = () => current < calculatePage();
  const handleItemRender = (
    page,
    type,
    originalElement,
    current,
    pathname,
    query,
    prefetchQuery
  ) => {
    switch (type) {
      case "prev":
        const prevPage = current - 1;
        return hasPrev() ? (
          <PageLink {...{ pathname, query }} page={prevPage}>
            {cloneElement(originalElement, {
              onMouseEnter: () => prefetchQuery(prevPage),
            })}
          </PageLink>
        ) : (
          originalElement
        );
      case "next":
        const nextPage = current + 1;
        return hasNext() ? (
          <PageLink {...{ pathname, query }} page={nextPage}>
            {cloneElement(originalElement, {
              onMouseEnter: () => prefetchQuery(nextPage),
            })}
          </PageLink>
        ) : (
          originalElement
        );
      case "page":
      default:
        return (
          <PageLink {...{ pathname, page, query }}>
            {cloneElement(originalElement, {
              onMouseEnter: () => prefetchQuery(page),
            })}
          </PageLink>
        );
    }
  };

  return (
    <BookList
      {...{ dataSource, grid, ...props }}
      locale={{
        emptyText: (
          <>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={/*"Книги не найдены"*/ null}
            />
            <Title level={2}>Книги не найдены</Title>
            <Paragraph style={{ marginTop: "-20px" }}>
              Вы можете отправить нам заявку на{" "}
              <a style={{ textDecoration: "underline" }}>
                library@strelka-kb.com
              </a>
            </Paragraph>
          </>
        ),
      }}
      pagination={
        current &&
        total && {
          current,
          pageSize,
          total,
          itemRender: (page, type, originalElement) =>
            handleItemRender(
              page,
              type,
              originalElement,
              current,
              `${pathname}${catalog ? `/${catalog}` : ""}`,
              rest,
              prefetchQuery
            ),
          showSizeChanger: false,
          hideOnSinglePage: true,
          showLessItems: !sm,
        }
      }
      renderItem={(item) => {
        const { __typename, bookKey, ...bookMeta } = {
          ...item,
        };

        return (
          <BookListItem>
            <Component {...{ bookKey, userId, ...bookMeta }} />
          </BookListItem>
        );
      }}
    />
  );
};

export default Catalog;
