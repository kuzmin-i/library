import React, { useState } from "react";
import styled from "styled-components";

import { Form } from "antd";
import BottomPanel from "./bottom-panel";
import BookEdit from "./book-edit";
import AuthorEdit from "./author-edit";
import PublicationEdit from "./publication-edit";
import FiltersWrapper from "./filters-wrapper";

import Books from "./tables/books";
import Authors from "./tables/authors";
import Publishers from "./tables/publishers";

import { wireColumns } from "./columns/wire";
import { bookColumns } from "./columns/books";
import { authorColumns } from "./columns/authors";
import { publisherColumns } from "./columns/publishers";

import UserStricter from "./user-stricter";

const FrameWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 48px);
  overflow: scroll;

  position: fixed;
  top: 48px;

  background: white;
`;

const AdminList = () => {
  /* выбранный раздел БД */
  const [section, setSection] = useState("books");
  const [total, setTotal] = useState(0);

  /* фильтры */
  const [query, setQuery] = useState(null);

  const [lang, setLang] = useState("all");
  const [author, setAuthor] = useState("all");
  /*const [year, setYear] = useState("all");*/
  const [catalog, setCatalog] = useState("all");
  const [sort, setSort] = useState("default");

  /* end: фильтры */
  const [editForm, showEditForm] = useState(false);
  const [editAuthorForm, showEditAuthorForm] = useState(false);
  const [editPublicationForm, showEditPublicationForm] = useState(false);

  const [selectedBookID, setSelectedBookID] = useState(null);

  const [filterPanel, openFilterPanel] = useState(false);

  const handleFilters = (filters) => {
    const {
      catalog: _catalog,
      query: _query,
      author: _author,
      year: _year,
      lang: _lang,
      sort: _sort,
    } = {
      ...filters,
    };

    setCatalog(_catalog);
    setQuery(_query);
    setAuthor(_author);
    setSort(_sort);
    setLang(_lang);
  };

  const tableParams = {
    query,
    lang,
    catalog,
    sort,
    author,
    section,
    /* */
    showEditForm,
    showEditAuthorForm,
    showEditPublicationForm,
    /* */
    wireColumns,
    setSelectedBookID,
    /* */
    total,
    setTotal,
  };

  return (
    <UserStricter>
      {/* таблица */}
      <FrameWrapper>
        {section === "books" && (
          <Books columns={bookColumns} {...tableParams} />
        )}

        {section === "authors" && (
          <Authors columns={authorColumns} {...tableParams} />
        )}

        {section === "publishers" && (
          <Publishers columns={publisherColumns} {...tableParams} />
        )}
      </FrameWrapper>

      {/* нижняя панель */}
      <Form
        onValuesChange={(changedValues, allValues) => {
          handleFilters({
            ...allValues,
            shallow: !changedValues.hasOwnProperty("catalog"),
          });
        }}
      >
        <BottomPanel
          total={total}
          add={showEditForm}
          addAuthor={showEditAuthorForm}
          addPublisher={showEditPublicationForm}
          {...{ filterPanel, openFilterPanel }}
          {...{ section, setSection }}
        />

        <FiltersWrapper
          visible={filterPanel}
          {...{ openFilterPanel, section }}
        />
      </Form>

      {/* всплывающее окно с добавлением книги */}
      {editForm && (
        <BookEdit
          visible={editForm}
          set={showEditForm}
          {...{ setSelectedBookID, selectedBookID }}
        />
      )}

      {editAuthorForm && (
        <AuthorEdit
          visible={editAuthorForm}
          set={showEditAuthorForm}
          {...{ setSelectedBookID, selectedBookID }}
        />
      )}

      {editPublicationForm && (
        <PublicationEdit
          visible={editPublicationForm}
          set={showEditPublicationForm}
          {...{ setSelectedBookID, selectedBookID }}
        />
      )}
    </UserStricter>
  );
};

export default AdminList;
