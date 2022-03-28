import { gql } from "@apollo/client";

const AUTH_QUERY = gql`
  query tokenQuery($provider: String!, $accessToken: String!) {
    token(provider: $provider, input: { access_token: $accessToken })
      @rest(type: "Token", path: "/{args.provider}", method: "POST") {
      access_token
    }
  }
`;

const BOOK_STATE_FRAGMENT = gql`
  fragment bookStateFragment on book_hub {
    state {
      book_id
      op_code
      exp
      user {
        id
        meta {
          first_name
          last_name
        }
      }
    }
  }
`;

const BOOK_META_FRAGMENT = gql`
  fragment bookMetaFragment on book_hub {
    id
    cr
    bookKey: key
    name
    thumb
    authors {
      author {
        id
        name
      }
    }
  }
`;

const CATALOG_META_FRAGMENT = gql`
  fragment catalogMetaFragment on catalog_hub {
    id
    name
    key
  }
`;

const BOOK_QUERY = gql`
  query bookQuery($id: uuid!) {
    book(id: $id) {
      ...bookMetaFragment
      authors {
        author {
          id
          about
        }
      }
      about
      comment
      year
      lang
      isbn
      url
      tags
      pages
      first_publish_year
      publishers {
        publisher {
          name
          id
        }
      }
      catalogs {
        catalog {
          ...catalogMetaFragment
        }
      }
    }
  }

  ${BOOK_META_FRAGMENT}
  ${CATALOG_META_FRAGMENT}
`;

const BOOKS_QUERY = gql`
  query booksQuery(
    $query: String
    $year: Int
    $lang: jsonb
    $catalog: uuid
    $author: uuid
    $pageSize: Int = 2000
    $offset: Int = 0
    $otherLang: jsonb = []
    $orderBy: [book_hub_order_by!] = { cr: desc_nulls_last }
  ) {
    books(
      where: {
        catalogs: { catalog_id: { _eq: $catalog } }
        year: { _eq: $year }
        lang: { _contains: $lang }
        authors: { author_id: { _eq: $author } }
        _or: [
          { name: { _ilike: $query } }
          { authors: { author: { name: { _ilike: $query } } } }
          { catalogs: { catalog: { name: { _ilike: $query } } } }
          { isbn: { _ilike: $query } }
          { key: { _ilike: $query } }
        ]
        _not: { lang: { _contained_in: $otherLang } }
      }
      limit: $pageSize
      offset: $offset
      order_by: $orderBy
    ) {
      ...bookMetaFragment
      catalogs {
        catalog {
          id
          key
        }
      }
    }
    book_aggregate(
      where: {
        catalogs: { catalog_id: { _eq: $catalog } }
        year: { _eq: $year }
        lang: { _contains: $lang }
        authors: { author_id: { _eq: $author } }
        _or: [
          { name: { _ilike: $query } }
          { authors: { author: { name: { _ilike: $query } } } }
          { catalogs: { catalog: { name: { _ilike: $query } } } }
          { isbn: { _ilike: $query } }
          { key: { _ilike: $query } }
        ]
        _not: { lang: { _contained_in: $otherLang } }
      }
    ) {
      aggregate {
        count
      }
    }
  }

  ${BOOK_META_FRAGMENT}
`;

const BOOKS_STATUSES_QUERY = gql`
  query booksStatusesQuery(
    $query: String
    $year: Int
    $lang: jsonb
    $catalog: uuid
    $author: uuid
    $pageSize: Int = 500
    $offset: Int = 0
    $otherLang: jsonb = []
    $orderBy: [book_hub_order_by!] = { cr: desc_nulls_last }
  ) {
    books(
      where: {
        catalogs: { catalog_id: { _eq: $catalog } }
        year: { _eq: $year }
        lang: { _contains: $lang }
        authors: { author_id: { _eq: $author } }
        _or: [
          { name: { _ilike: $query } }
          { authors: { author: { name: { _ilike: $query } } } }
          { catalogs: { catalog: { name: { _ilike: $query } } } }
          { isbn: { _ilike: $query } }
          { key: { _ilike: $query } }
        ]
        _not: { lang: { _contained_in: $otherLang } }
      }
      limit: $pageSize
      offset: $offset
      order_by: $orderBy
    ) {
      id
      ...bookStateFragment
    }
  }

  ${BOOK_STATE_FRAGMENT}
`;

const BOOK_STATUS_SUBSCRIPTION = gql`
  subscription bookStatusSubscription($id: uuid!) {
    book(id: $id) {
      ...bookStateFragment
    }
  }

  ${BOOK_STATE_FRAGMENT}
`;

const OWN_TRANSACTION_FRAGMENT = gql`
  fragment ownTransactionFragment on own_transaction {
    id
    cr
    book {
      ...bookMetaFragment
    }
  }

  ${BOOK_META_FRAGMENT}
`;

const MY_BOOKS_QUERY = gql`
  query myBooksQuery($userId: uuid!) {
    taken: own_transaction(
      distinct_on: book_id
      order_by: { book_id: desc_nulls_last, cr: desc_nulls_last }
      where: {
        book: { state: { op_code: { _eq: 1 }, user_id: { _eq: $userId } } }
      }
    ) {
      ...ownTransactionFragment
    }
    returned: own_transaction(
      distinct_on: book_id
      order_by: { book_id: desc_nulls_last, cr: desc_nulls_last }
      where: {
        book: { state: { op_code: { _eq: 0 }, user_id: { _eq: $userId } } }
      }
    ) {
      ...ownTransactionFragment
    }
  }

  ${BOOK_META_FRAGMENT}
  ${OWN_TRANSACTION_FRAGMENT}
`;

const BOOK_STATE_QUERY = gql`
  query bookStateQuery($id: uuid!) {
    book(id: $id) {
      id
      ...bookStateFragment
    }
  }

  ${BOOK_STATE_FRAGMENT}
`;

const CHECK_BOOK_QUERY = gql`
  query checkBookQuery($bookId: String!, $id: uuid!, $userId: uuid!) {
    checkBook(book_id: $bookId) {
      is_free
      is_belongs
      is_expired
    }
    book(id: $id) {
      ...bookStateFragment
    }
    me {
      transactions_aggregate(
        distinct_on: book_id
        where: {
          book: { state: { op_code: { _eq: 1 }, user_id: { _eq: $userId } } }
        }
      ) {
        aggregate {
          count
        }
      }
    }
  }

  ${BOOK_STATE_FRAGMENT}
`;

const TAKE_BOOK_MUTATION = gql`
  mutation takeBookMutation($id: String!) {
    takeBook(book_id: $id) {
      book_id
      book {
        ...bookMetaFragment
      }
      expires
    }
  }

  ${BOOK_META_FRAGMENT}
`;

const RETURN_BOOK_MUTATION = gql`
  mutation returnBookMutation($id: String!) {
    backBook(book_id: $id) {
      book_id
      book {
        ...bookMetaFragment
      }
      is_expired
    }
  }

  ${BOOK_META_FRAGMENT}
`;

const CATALOG_QUERY = gql`
  query catalogQuery($id: uuid!) {
    catalogs(where: { id: { _eq: $id } }) {
      ...catalogMetaFragment
    }
  }

  ${CATALOG_META_FRAGMENT}
`;

const FILTER_OPTIONS_QUERY = gql`
  query filterOptionsQuery {
    authors(order_by: { name: asc_nulls_last }, where: { books: {} }) {
      id
      name
    }
    catalogs(order_by: { ordering: asc_nulls_last }) {
      ...catalogMetaFragment
    }
  }

  ${CATALOG_META_FRAGMENT}
`;

const BOOKS_PATHS_QUERY = gql`
  query booksPathsQuery {
    books {
      id
    }
  }
`;

const CATALOGS_PATHS_QUERY = gql`
  query catalogsPathsQuery {
    catalogs {
      id
    }
  }
`;

const MAIN_PAGE_QUERY = gql`
  query mainPageQuery {
    recent: books(limit: 4, order_by: { cr: desc_nulls_last }) {
      ...bookMetaFragment
      catalogs {
        catalog {
          ...catalogMetaFragment
        }
      }
    }
    catalogs {
      ...catalogMetaFragment
      key
      books_aggregate {
        aggregate {
          count
        }
      }
    }
  }

  ${BOOK_META_FRAGMENT}
  ${CATALOG_META_FRAGMENT}
`;

export {
  AUTH_QUERY,
  MAIN_PAGE_QUERY,
  BOOK_QUERY,
  BOOKS_QUERY,
  BOOKS_STATUSES_QUERY,
  BOOK_STATUS_SUBSCRIPTION,
  MY_BOOKS_QUERY,
  BOOK_STATE_QUERY,
  CHECK_BOOK_QUERY,
  TAKE_BOOK_MUTATION,
  RETURN_BOOK_MUTATION,
  BOOKS_PATHS_QUERY,
  CATALOG_QUERY,
  FILTER_OPTIONS_QUERY,
  CATALOGS_PATHS_QUERY,
};
