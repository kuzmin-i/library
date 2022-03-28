import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/client";
import styled from "styled-components";

import { useLazyQuery } from "@apollo/client";
import { PUBLISHERS_QUERY } from "@/lib/apollo/admin_queries";
import { handleQueryArr, isNotBlankStr } from "@/lib/helpers";

import InfiniteScroll from "react-infinite-scroll-component";

import Container from "@/components/layout/container";
import { Table, Divider } from "antd";

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

const Publishers = ({
  query,
  lang,
  catalog,
  sort,
  setTotal,
  total,
  author,
  section,
  showEditPublicationForm,
  columns,
  wireColumns,
  setSelectedBookID,
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
  const [getPublishers, { data, loading, error }] = useLazyQuery(
    PUBLISHERS_QUERY,
    {}
  );

  /* достать записи по книгам */
  useEffect(() => {
    if (section === "publishers") {
      const isNotBlank = isNotBlankStr(query);
      const [_field, order] = sort ? handleQueryArr(sort).split("_") : [];
      const field = _field === "year" ? "cr" : _field;

      const variables = {
        ...(isNotBlank && { query: `%${handleQueryArr(query)}%` }),
        ...(field &&
          order && {
            orderBy: {
              [field || "cr"]: `${order || "desc"}_nulls_${
                (field === "name" && order === "desc") ||
                (field === "cr" && order === "asc")
                  ? "first"
                  : "last"
              }`,
            },
          }),
      };

      getPublishers({ variables });
    }
  }, [query, section, sort]);

  useEffect(() => {
    /* раскладываем полученные записи */
    const isLoading = !data || loading;
    setLoading(isLoading);

    const { publishers = [], publisher_aggregate } = { ...data };
    const { aggregate } = { ...publisher_aggregate };
    const { count: total = 0 } = { ...aggregate };

    /* оформляем финальный вывод записей в массиве */
    const dataSource = publishers.map((publisher) => {
      return {
        ...publisher,
        editMode: showEditPublicationForm,
        setSelectedBookID,
      };
    });

    if (total) setTotal(total);
    if (dataSource) {
      setDataSource(dataSource);
      setVizDataSource([]);
      setActivePage(1);
    }
  }, [data, loading]);

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
            Показаны все издательства 🤐
          </Divider>
        </Container>
      }
      height={"calc(100vh - 48px)"}
    >
      <Container>
        {dataSource && !isLoading ? (
          <CustomTable
            pagination={false}
            columns={columns}
            sticky
            dataSource={vizDataSource}
            pagination={false}
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

export default Publishers;
