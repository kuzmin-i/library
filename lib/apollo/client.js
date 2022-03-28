import { useMemo } from "react";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  from,
  fromPromise,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RestLink } from "apollo-link-rest";
import { getSession, signOut } from "next-auth/client";

const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
const secret = process.env.ADMIN_SECRET;

let apolloClient;

const ssrMode = typeof window === "undefined";
const defaultOptions = {
  watchQuery: {
    errorPolicy: "all",
  },
  query: {
    errorPolicy: "all",
  },
  mutation: {
    errorPolicy: "all",
  },
};
const handleHeaders = (headers, token) => ({
  headers: {
    ...headers,
    Authorization: token ? `Bearer ${token}` : "",
  },
});

// rest client for authenticating user
const authLink = new RestLink({
  uri: endpoint + "/auth/v1/kb/oauth",
});
export const authClient = new ApolloClient({
  link: authLink,
  cache: new InMemoryCache(),
  defaultOptions,
});

const createErrorLink = () =>
  onError(({ graphQLErrors, operation, forward }) => {
    const jwtErrors =
      graphQLErrors?.length &&
      graphQLErrors.filter((error) => {
        const { code } = { ...error?.extensions };

        return code === "invalid-jwt" || code === "invalid-headers";
      });

    if (jwtErrors?.length > 0) {
      fromPromise(
        getSession().then((session) => {
          const { accessToken } = { ...session };

          if (accessToken) {
            const { headers } = operation.getContext();
            // modify the operation context with a new token
            operation.setContext(handleHeaders(headers, accessToken));
          } else {
            !ssrMode && signOut();
          }
          // retry the request, returning the new observable
          return forward(operation);
        })
      ).flatMap(() => forward(operation));
    }
  });

// user scoped link with auth token
const createUserLink = () =>
  setContext(async (_, { headers }) => {
    const session = await getSession();
    const { accessToken } = { ...session };

    return handleHeaders(headers, accessToken);
  });

const link = new HttpLink({
  uri: endpoint + "/library/v1/graphql",
});

// Link with admin secret
const appLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    ...(ssrMode && { "x-hasura-admin-secret": secret }),
  },
}));

const createApolloClient = () =>
  new ApolloClient({
    ssrMode,
    connectToDevTools: process.env.NODE_ENV === "development",
    link: from([
      ...(ssrMode ? [appLink] : [createErrorLink(), createUserLink()]),
      link,
    ]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            checkBook: {
              merge: false,
            },
            own_transaction: {
              merge: false,
            },
          },
        },
        TakenBookModel: {
          keyFields: ["book_id"],
        },
        BackedBookModel: {
          keyFields: ["book_id"],
        },
        CheckedBookModel: {
          keyArgs: ["book_id"],
        },
        book_state_view: {
          keyFields: ["book_id"],
        },
      },
    }),
    defaultOptions,
  });

export const initializeApollo = (initialState = null) => {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();
    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }
  // For SSG and SSR always create a new Apollo Client
  if (ssrMode) return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

export const useApollo = (initialState) =>
  useMemo(() => initializeApollo(initialState), [initialState]);
