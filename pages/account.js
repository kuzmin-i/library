import { useEffect } from "react";
import { useSession } from "next-auth/client";
import { useQuery } from "@apollo/client";
import { message, Typography, Space } from "antd";
import styled from "styled-components";

import { MY_BOOKS_QUERY } from "@/lib/apollo/queries";
import Container, { PageContainer } from "@/components/layout/container";
import Catalog from "@/components/books-catalog/catalog";
import MyBookCard from "@/components/book/my-book-card";
import { mediaSm } from "@/styles/theme/breakpoints";
import { SkeletonCard } from "@/components/layout/page-loading";

const { Title } = Typography;

export const BooksContainer = styled.div`
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: var(--color-grey);

  ${mediaSm} {
    padding: 1rem;
  }

  .ant {
    &-list {
      .ant-col {
        height: 100%;
      }

      .ant-col,
      .ant-list-item {
        display: flex;
        flex-direction: column;
      }
    }

    &-list-item,
    &-card {
      flex-grow: 1;
    }

    &-card {
      padding: 1rem;
      border-radius: 0.5rem;
    }
  }
`;

const Account = () => {
  const [session] = useSession();
  const { user, userId } = { ...session };
  const { name } = { ...user };

  const { data, loading, error } = useQuery(MY_BOOKS_QUERY, {
    variables: { userId },
    skip: !userId,
  });

  useEffect(() => error && message.error("Ошибка загрузки данных"), [error]);

  const { taken = [], returned = [] } = { ...data };

  const sortBooksByCr = (books) =>
    [...books]
      .sort((a, b) => new Date(b?.cr) - new Date(a?.cr))
      .map((takenBook) => {
        const { book } = { ...takenBook };
        const { __typename, ...rest } = { ...book };

        return rest;
      });

  const catalogs = [
    { title: "Активные", books: taken, placeholders: 1 },
    { title: "Прошлые", books: returned, placeholders: 3 },
  ];

  return (
    <PageContainer>
      <Container>
        <Space direction="vertical" size={32} style={{ width: "100%" }}>
          <Title level={2}>{`Мои книги${name && ` [${name}]`}`}</Title>
          {catalogs.map(({ title, books, placeholders }, i) => (
            <BooksContainer key={i}>
              <Title level={3}>{title}</Title>
              <Catalog
                dataSource={
                  loading ? Array(placeholders).fill({}) : sortBooksByCr(books)
                }
                component={loading ? SkeletonCard : MyBookCard}
                grid={{ gutter: 24, column: 3, xs: 1, sm: 1, md: 2, lg: 2 }}
              />
            </BooksContainer>
          ))}
        </Space>
      </Container>
    </PageContainer>
  );
};

export default Account;
