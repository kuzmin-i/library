import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { useLazyQuery } from "@apollo/client";
import { message } from "antd";

import { BOOKS_QUERY, BOOKS_STATUSES_QUERY } from "@/lib/apollo/queries";
import Catalog from "@/components/books-catalog/catalog";
import { handleQueryArr, isNotBlankStr } from "@/lib/helpers";
import { SkeletonCard } from "@/components/layout/page-loading";

const BooksCatalog = ({ pageSize = 12 }) => {
  const [session] = useSession();
  const { userId } = { ...session };

  const { query } = useRouter();
  const { page } = { ...query };

  const getCurrentPage = (page) => parseInt(handleQueryArr(page)) || 1;
  const current = getCurrentPage(page);

  const [getBooks, { data, loading, error, client }] = useLazyQuery(
    BOOKS_QUERY
  );
  const [getBooksStatuses, { data: statusesData }] = useLazyQuery(
    BOOKS_STATUSES_QUERY,
    {
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );

  const isLoading = !data || loading;
  const { books = [], book_aggregate } = { ...data };
  const { aggregate } = { ...book_aggregate };
  const { count: total = 0 } = { ...aggregate };

  const { books: booksStatuses = [] } = { ...statusesData };

  const dataSource = books.map((book) => {
    const { id } = { ...book };
    const { state } = { ...booksStatuses.find((book) => book?.id === id) };

    return {
      ...book,
      state,
    };
  });

  const handleVariables = (queryString) => {
    const { slug, query, year, lang, sort, author, page } = {
      ...queryString,
    };
    const [, catalog] = slug || [];
    const isNotBlank = isNotBlankStr(query);
    const current = getCurrentPage(page);
    const language = handleQueryArr(lang);
    const [field, order] = sort ? handleQueryArr(sort).split("_") : [];

    return {
      variables: {
        ...(isNotBlank && { query: `%${handleQueryArr(query)}%` }),
        ...(catalog && { catalog }),
        ...(year && { year: parseInt(handleQueryArr(year)) }),
        ...(lang &&
          (language === "other"
            ? { otherLang: ["ru", "en"] }
            : { lang: language })),
        ...(author && { author: handleQueryArr(author) }),
        ...(field &&
          order && {
            orderBy: {
              [field || "cr"]: `${order || "desc"}_nulls_${
                (field === "name" && order === "desc") ||
                (field === "year" && order === "asc")
                  ? "first"
                  : "last"
              }`,
            },
          }),
        pageSize,
        offset: pageSize * (current - 1),
      },
    };
  };

  useEffect(() => {
    getBooks(handleVariables(query));
    getBooksStatuses(handleVariables(query));
  }, [query]);

  useEffect(() => error && message.error("Ошибка загрузки данных"), [error]);

  return (
    <Catalog
      {...{ dataSource, current, total, query, userId }}
      dataSource={isLoading ? Array(12).fill({}) : dataSource}
      component={isLoading && SkeletonCard}
      pathname="/catalog"
      prefetchQuery={(page) =>
        client.query({
          query: BOOKS_QUERY,
          ...handleVariables({ ...query, page }),
        })
      }
    />
  );
};

export default BooksCatalog;
