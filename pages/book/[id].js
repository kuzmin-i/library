// @refresh reset

import { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/client";
import { NextSeo } from "next-seo";
import { useMutation, useQuery } from "@apollo/client";
import styled from "styled-components";
import {
  Alert,
  Breadcrumb,
  Button,
  Col,
  Divider,
  Grid,
  message,
  Row,
  Space,
  Typography,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { initializeApollo } from "@/lib/apollo/client";
import {
  BOOK_QUERY,
  BOOKS_PATHS_QUERY,
  CHECK_BOOK_QUERY,
  MY_BOOKS_QUERY,
  RETURN_BOOK_MUTATION,
  TAKE_BOOK_MUTATION,
} from "@/lib/apollo/queries";
import Container, { PageContainer } from "@/components/layout/container";
import SearchBar from "@/components/books-catalog/search-bar";
import { getPageUrl } from "@/lib/helpers";
import { bookErrors } from "@/constants";
import {
  createTransactionResponse,
  updateTransactionsCache,
} from "@/lib/helpers/update-cache";
import BookMeta from "@/components/book/book-meta";
import AboutAuthors from "@/components/book/about-authors";
import BookImage from "@/components/book/book-image";
import handleBookDialog from "@/lib/helpers/handle-book-dialog";
import { animatedLink } from "@/styles/theme/global-style";

const { useBreakpoint } = Grid;
const { Text, Paragraph } = Typography;

const BookContainer = styled(Container)`
  ${animatedLink}

  .ant {
    &-typography-expand {
      display: block;
      margin-top: 0.5rem;
      margin-left: 0;
      text-decoration: underline;
    }

    &-alert-info .ant-alert-icon {
      color: var(--color-grey-dark);
    }
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  padding-top: 100%;
`;

const Book = ({
  id,
  name,
  about,
  thumb,
  authors,
  catalogs,
  // url,
  ...props
}) => {
  const [session] = useSession();
  const { userId } = { ...session };

  const { sm = true } = useBreakpoint();

  const { catalog } = { ...catalogs?.[0] };
  const { id: catalogId, name: catalogName } = { ...catalog };
  const bookResponse = {
    id,
    name,
    thumb,
    authors,
  };

  const variables = { id, bookId: id, userId };
  const params = {
    query: CHECK_BOOK_QUERY,
    variables,
  };

  const { data, loading: checkLoading, error: checkError, client } = useQuery(
    CHECK_BOOK_QUERY,
    {
      variables,
      skip: !id,
      fetchPolicy: "cache-and-network",
    }
  );

  const { checkBook, book, me } = { ...data };
  const { is_free, is_belongs } = { ...checkBook };
  const { state } = { ...book };

  const [{ transactions_aggregate }] = me || [{}];
  const { aggregate } = { ...transactions_aggregate };
  const { count } = { ...aggregate };
  const isLimitExceed = count >= 3;
  const isOverLimitBook = is_belongs === false && isLimitExceed;
  const isSomeonesBook = is_belongs === false && is_free === false;

  const [
    handleTransaction,
    { loading: transactionLoading, error: transactionError },
  ] = useMutation(is_belongs ? RETURN_BOOK_MUTATION : TAKE_BOOK_MUTATION, {
    refetchQueries: [{ query: CHECK_BOOK_QUERY, variables }],
    awaitRefetchQueries: true,
  });

  const loading = checkLoading || transactionLoading;
  const error = checkError || transactionError;

  const handleErrorMessage = (error) =>
    error?.graphQLErrors?.map((error) => {
      const { code } = { ...error?.extensions };
      const { [code]: errorMessage } = { ...bookErrors };

      return message.error(errorMessage || "Ошибка");
    });

  useEffect(() => error && handleErrorMessage(error), [error]);

  const breadcrumbs = [
    { href: "/catalog", name: "Каталог" },
    ...(catalog ? [{ href: `/catalog/${catalogId}`, name: catalogName }] : []),
    { name },
  ];
  const imageUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/upload/thumb/${thumb}`;
  const authorsWithAbout =
    authors?.length > 0
      ? authors.filter((author) => author?.author?.about)
      : [];

  const handleBookTransaction = () =>
    handleTransaction({
      variables,
      optimisticResponse: createTransactionResponse(
        is_belongs,
        bookResponse,
        userId
      ),
      update: (cache, mutationResult) =>
        updateTransactionsCache(
          cache,
          mutationResult,
          params,
          userId,
          is_belongs
        ),
    });

  return (
    <>
      <NextSeo
        title={name}
        description={about}
        noindex={true}
        openGraph={{
          title: name,
          description: about,
          images: [{ url: imageUrl }],
          url: getPageUrl(),
        }}
      />
      <SearchBar />
      <PageContainer>
        <BookContainer>
          <Space direction="vertical" size={32} style={{ width: "100%" }}>
            <Breadcrumb separator="→">
              {breadcrumbs.map(({ href, name }, i) => (
                <Breadcrumb.Item key={i}>
                  {href ? <Link {...{ href }}>{name}</Link> : name}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </Space>
          <Divider style={{ borderTop: "2px solid var(--color-black)" }} />
          <Row gutter={[32, 32]}>
            <Col span={24} md={8}>
              {thumb && (
                <ImageWrapper>
                  <BookImage
                    src={imageUrl}
                    alt={name || ""}
                    layout="fill"
                    sizes="(max-width: 575.98px) 544px, (max-width: 767.98px) 208px, (max-width: 991.98px) 280px, 352px"
                    objectFit="contain"
                    objectPosition="center"
                    large
                  />
                </ImageWrapper>
              )}
            </Col>
            <Col span={24} md={16}>
              <Space direction="vertical" size={32} style={{ width: "100%" }}>
                <BookMeta
                  {...{
                    id,
                    name,
                    authors,
                    catalogs,
                    state,
                    userId,
                    loading,
                    ...props,
                  }}
                />
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  {!loading && (isSomeonesBook || isOverLimitBook) && (
                    <Alert
                      message={
                        isSomeonesBook
                          ? "Эта книга сейчас на руках у другого пользователя"
                          : "Вы можете взять не больше 3-х книг"
                      }
                      type={isSomeonesBook ? "info" : "warning"}
                      showIcon
                    />
                  )}
                  <Space
                    direction={sm ? "horizontal" : "vertical"}
                    style={{ width: "100%" }}
                  >
                    <Button
                      type="primary"
                      danger={is_belongs}
                      block={!sm}
                      size={!sm && "large"}
                      disabled={loading || isOverLimitBook || isSomeonesBook}
                      onClick={() =>
                        handleBookDialog(is_belongs, handleBookTransaction)
                      }
                    >
                      {loading ? (
                        <LoadingOutlined />
                      ) : (
                        `${is_belongs ? "Сдать" : "Взять"} книгу`
                      )}
                    </Button>
                    {/*{url && (*/}
                    {/*  <Button href={url} download>*/}
                    {/*    Скачать PDF*/}
                    {/*  </Button>*/}
                    {/*)}*/}
                    <Link href="/account" passHref>
                      <Button
                        size={!sm && "large"}
                        block={!sm}
                        onMouseEnter={() =>
                          client.query({
                            query: MY_BOOKS_QUERY,
                            variables: { userId },
                          })
                        }
                      >
                        Мои книги
                      </Button>
                    </Link>
                  </Space>
                </Space>
                <Space direction="vertical">
                  {about && (
                    <Space direction="vertical">
                      <Text type="secondary">О книге:</Text>
                      <Paragraph
                        ellipsis={{
                          rows: 4,
                          expandable: true,
                          symbol: "Читать далее",
                        }}
                      >
                        {about}
                      </Paragraph>
                    </Space>
                  )}
                  {authorsWithAbout.length > 0 && (
                    <AboutAuthors authors={authorsWithAbout} />
                  )}
                </Space>
              </Space>
            </Col>
          </Row>
        </BookContainer>
      </PageContainer>
    </>
  );
};

export const getStaticPaths = async () => {
  const client = initializeApollo();
  const data = await client
    .query({ query: BOOKS_PATHS_QUERY })
    .then((res) => res?.data?.books)
    .catch((err) => console.error(err?.message));

  const paths =
    data?.map(({ id }) => ({
      params: { id },
    })) || [];

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  try {
    const { id } = { ...params };
    const client = initializeApollo();

    const data = await client
      .query({
        query: BOOK_QUERY,
        variables: { id },
      })
      .then((res) => res?.data?.book)
      .catch((err) => console.error(err?.message));

    const { __typename, ...meta } = { ...data };

    return data
      ? {
          props: {
            ...meta,
            initialApolloState: client.cache.extract(),
          },
          revalidate: 60,
        }
      : {
          notFound: true,
          revalidate: 60,
        };
  } catch (err) {
    console.error(err?.message);

    return {
      notFound: true,
      revalidate: 60,
    };
  }
};

export default Book;
