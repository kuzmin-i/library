import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/client";
import styled from "styled-components";

import { useLazyQuery } from "@apollo/client";
import { BOOKS_QUERY, BOOKS_STATUSES_QUERY } from "@/lib/apollo/queries";
import { handleQueryArr, isNotBlankStr } from "@/lib/helpers";

import InfiniteScroll from "react-infinite-scroll-component";

import Container from "@/components/layout/container";
import { Table, Skeleton, Divider } from "antd";

const CustomTable = styled(Table)`
  && * {
    font-size: 13px;
    line-height: 1.2;
  }

  && a {
    color: #5d5fef;
  }

  && div.ant-typography {
    margin-bottom: 0;
  }

  & .ant-table-tbody > tr > td {
    padding: 14px 14px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.02);
  }

  & tr.ant-table-row:hover > td {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const query_extraParams = {
  fetchPolicy: "network-only",
  nextFetchPolicy: "cache-first",
};

const Books = ({
  query,
  lang,
  catalog,
  sort,
  total,
  setTotal,
  author,
  section,
  showEditForm,
  columns,
  wireColumns,
  setSelectedBookID,
  setNewRecord,
}) => {
  /* стейты и константы для бесконечной подгрузки данных */
  /* */
  const [dataSource, setDataSource] = useState([]);
  const [vizDataSource, setVizDataSource] = useState([]);
  const [isLoading, setLoading] = useState(null);

  const [activePage, setActivePage] = useState(1);
  const pageSize = 20;
  /* */

  /* use query */
  const [getBooks, { data, loading, error }] = useLazyQuery(BOOKS_QUERY, {});

  const [
    getBooksStatuses,
    { data: statusesData, error: statusesError },
  ] = useLazyQuery(BOOKS_STATUSES_QUERY, query_extraParams);

  /* достать записи по книгам */
  useEffect(() => {
    if (section === "books") {
      const isNotBlank = isNotBlankStr(query);
      const language = handleQueryArr(lang);
      const [field, order] = sort ? handleQueryArr(sort).split("_") : [];

      const variables = {
        ...(isNotBlank && { query: `%${handleQueryArr(query)}%` }),
        ...(catalog !== "all" ? { catalog } : null),
        ...(lang !== "all"
          ? language === "other"
            ? { otherLang: ["ru", "en"] }
            : { lang: language }
          : null),
        ...(author !== "all" ? { author: handleQueryArr(author) } : null),
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
      };

      getBooks({ variables });
      getBooksStatuses({ variables });
    }
  }, [query, lang, catalog, author, section, sort]);

  /* достаем id пользователя */
  const [session] = useSession();
  const { userId } = { ...session };

  useEffect(() => {
    /* раскладываем полученные записи */
    const _isLoading = !data || loading;
    setLoading(_isLoading);

    const { books = [], book_aggregate } = { ...data };
    const { aggregate } = { ...book_aggregate };
    const { count: total = 0 } = { ...aggregate };

    const { books: booksStatuses = [] } = { ...statusesData };

    /* оформляем финальный вывод записей в массиве */
    const dataSource = books.map((book) => {
      const { id } = { ...book };
      const { state } = { ...booksStatuses.find((book) => book?.id === id) };

      return {
        ...book,
        state: { ...state, userId },
        editMode: showEditForm,
        setNewRecord,
        setSelectedBookID,
      };
    });

    if (total) setTotal(total);
    if (dataSource) {
      setDataSource(dataSource);
      setVizDataSource([]);
      setActivePage(1);
    }
  }, [data, statusesData, loading, userId]);

  /* подгрузка записей
  /* useEffect добавляет в общий массив новый фрагмент записей */
  /*
  /* */
  useEffect(() => {
    const offset = pageSize * (activePage - 1);

    setVizDataSource((state) =>
      state.concat(dataSource.slice(offset, offset + pageSize))
    );
  }, [dataSource, pageSize, activePage]);

  /* Подгрузка записей */
  const loadMoreData = () => {
    setTimeout(() => {
      setActivePage((page) => page + 1);
    }, 700);
  };

  return (
    <InfiniteScroll
      dataLength={vizDataSource.length}
      next={!isLoading && loadMoreData}
      hasMore={!isLoading && vizDataSource.length < total}
      scrollThreshold="200px"
      loader={
        <Container>
          <CustomTable
            showHeader={false}
            columns={wireColumns}
            sticky
            dataSource={Array(2).fill({})}
            pagination={false}
          />
        </Container>
      }
      endMessage={
        <Container>
          <Divider plain style={{ marginBottom: "150px" }}>
            Показаны все книги 🤐
          </Divider>
        </Container>
      }
      height={"calc(100vh - 48px)"}
    >
      <Container>
        {dataSource && total && !isLoading ? (
          <CustomTable
            pagination={false}
            columns={columns}
            sticky
            dataSource={vizDataSource}
          />
        ) : (
          <CustomTable
            showHeader={false}
            columns={wireColumns}
            sticky
            dataSource={Array(22).fill({})}
            pagination={false}
          />
        )}
      </Container>
    </InfiniteScroll>
  );
};

export default Books;
