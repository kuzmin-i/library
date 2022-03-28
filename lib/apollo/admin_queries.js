import { gql } from "@apollo/client";

const AUTHORS_QUERY = gql`
  query authorsQuery(
    $query: String
    $pageSize: Int
    $offset: Int = 0
    $orderBy: [author_hub_order_by!] = { cr: desc_nulls_last }
  ) {
    authors(
      where: {
        _or: [{ name: { _ilike: $query } }, { about: { _ilike: $query } }]
      }
      limit: $pageSize
      offset: $offset
      order_by: $orderBy
    ) {
      about
      books_aggregate {
        aggregate {
          count
        }
      }
      name
      photo
      about
      up
      key
      id
      cr
    }

    author_aggregate(
      where: { _or: [{ name: { _ilike: $query } }] }
      limit: $pageSize
      offset: $offset
      order_by: $orderBy
    ) {
      aggregate {
        count
      }
    }
  }
`;

const PUBLISHERS_QUERY = gql`
  query publishersQuery(
    $query: String
    $pageSize: Int = 500
    $offset: Int = 0
    $orderBy: [publisher_hub_order_by!] = { cr: desc_nulls_last }
  ) {
    publishers(
      where: { _or: [{ name: { _ilike: $query } }] }
      limit: $pageSize
      offset: $offset
      order_by: $orderBy
    ) {
      books_aggregate {
        aggregate {
          count
        }
      }
      name
      up
      key
      id
      cr
    }

    publisher_aggregate(
      where: { _or: [{ name: { _ilike: $query } }] }
      limit: $pageSize
      offset: $offset
      order_by: $orderBy
    ) {
      aggregate {
        count
      }
    }
  }
`;

/* запросы для Edit Form */
/* Данные о всех авторах */
const AUTHORS_TAGS_QUERY = gql`
  query authors_forEditFormQuery {
    authors(order_by: { name: asc_nulls_last }, where: { books: {} }) {
      id
      name
    }
  }
`;

/* Данные о всех издательствах и категориях */
const CATALOG_META_FRAGMENT = gql`
  fragment catalogMetaFragment on catalog_hub {
    id
    name
    key
  }
`;

const PUBLISHERS_CATALOGS_TAGS_QUERY = gql`
  query publishers_forEditFormQuery {
    publishers(order_by: { name: asc_nulls_last }, where: { books: {} }) {
      id
      name
    }
    catalogs(order_by: { ordering: asc_nulls_last }) {
      ...catalogMetaFragment
    }
  }

  ${CATALOG_META_FRAGMENT}
`;

const ADD_BOOK = gql`
  mutation AddBook(
    $bookMeta: book_hub_insert_input!
    $authorsMeta: [book_author_link_insert_input!]!
    $publishersMeta: [book_publisher_link_insert_input!]!
    $catalogMeta: book_catalog_link_insert_input!
  ) {
    insert_book_hub_one(object: $bookMeta) {
      id
      name
      is_new_type
      cr
    }

    insert_book_author_link_one(objects: $authorsMeta) {
      affected_rows
    }

    insert_book_publisher_link(objects: $publishersMeta) {
      affected_rows
    }

    insert_book_catalog_link_one(object: $catalogMeta) {
      book_id
      catalog_id
    }
  }
`;

const GET_AUTHOR = gql`
  query getAuthor($id: uuid!) {
    author(id: $id) {
      id
      cr
      name
      about
      tags
    }
  }
`;

const GET_PUBLISHER = gql`
  query getPublisher($id: uuid!) {
    publisher(id: $id) {
      id
      cr
      name
      tags
    }
  }
`;

export {
  AUTHORS_QUERY,
  PUBLISHERS_QUERY,
  AUTHORS_TAGS_QUERY,
  PUBLISHERS_CATALOGS_TAGS_QUERY,
  /* */
  ADD_BOOK,
  /* */
  GET_AUTHOR,
  GET_PUBLISHER,
};
