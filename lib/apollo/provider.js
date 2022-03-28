import { useSession } from "next-auth/client";
import { ApolloProvider as Provider } from "@apollo/client";

import { useApollo } from "@/lib/apollo/client";

const ApolloProvider = ({ children, initialApolloState }) => {
  const [session] = useSession();
  const { accessToken } = { ...session };

  const client = useApollo(initialApolloState, accessToken);

  return <Provider {...{ client }}>{children}</Provider>;
};

export default ApolloProvider;
