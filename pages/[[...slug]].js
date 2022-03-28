import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { Typography } from "antd";

import { initializeApollo } from "@/lib/apollo/client";
import {
  BOOKS_QUERY,
  CATALOGS_PATHS_QUERY,
  FILTER_OPTIONS_QUERY,
} from "@/lib/apollo/queries";
import { getPageUrl, isNotBlankStr } from "@/lib/helpers";
import SearchBar from "@/components/books-catalog/search-bar";
import Container, { PageContainer } from "@/components/layout/container";
import BooksCatalog from "@/components/books-catalog";
import { siteTitle } from "@/next-seo.config";
import { ogImageUrl } from "@/constants";

const { Title } = Typography;

const Catalog = ({ title, authors, catalogs }) => {
  const { query } = useRouter();
  const { query: search, slug } = { ...query };

  return (
    <>
      <NextSeo
        {...{ title }}
        description={title}
        noindex={!!slug}
        openGraph={{
          title,
          description: title,
          url: getPageUrl(),
          ...(!slug && {
            images: [
              {
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: siteTitle,
              },
            ],
          }),
        }}
      />
      <SearchBar {...{ authors, catalogs }} filters />
      <PageContainer>
        <Container>
          <Title level={2}>
            {isNotBlankStr(search)
              ? `Результаты поиска [${search || ""}]`
              : title}
          </Title>
          <BooksCatalog />
        </Container>
      </PageContainer>
    </>
  );
};

export const getStaticPaths = async () => {
  try {
    const client = initializeApollo();
    const data = await client
      .query({ query: CATALOGS_PATHS_QUERY })
      .then((res) => res?.data?.catalogs)
      .catch((err) => console.error(err?.message));

    const catalogPaths =
      data?.map(({ id }) => ({
        params: { slug: ["catalog", id] },
      })) || [];
    const paths = [
      { params: { slug: false } },
      { params: { slug: ["catalog"] } },
      ...catalogPaths,
    ];

    return {
      paths,
      fallback: false,
    };
  } catch (err) {
    console.error(err?.message);

    return {
      notFound: true,
      revalidate: 60,
    };
  }
};

export const getStaticProps = async ({ params }) => {
  try {
    const { slug } = { ...params };
    const [, catalog] = slug || [];
    const client = initializeApollo();

    const data = await client
      .query({ query: FILTER_OPTIONS_QUERY })
      .then((res) => res?.data)
      .catch((err) => console.error(err?.message));

    const { authors, catalogs } = { ...data };
    const title = catalog
      ? catalogs?.find(({ id }) => id === catalog)?.name
      : "Каталог";

    await client.query({
      query: BOOKS_QUERY,
      variables: { ...(catalog && { catalog }), pageSize: 12, offset: 0 },
    });

    return {
      props: {
        title,
        authors,
        catalogs,
        initialApolloState: client.cache.extract(),
      },
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

export default Catalog;
