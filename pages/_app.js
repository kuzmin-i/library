import { useEffect } from "react";
import { useRouter } from "next/router";
import { Provider } from "next-auth/client";
import { DefaultSeo } from "next-seo";
import { ApolloProvider } from "@apollo/client";
import { ConfigProvider, Modal, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import locale from "antd/lib/locale/ru_RU";
import moment from "moment";
import "moment/locale/ru";

import "@/styles/globals.css";
import GlobalStyle from "@/styles/theme/global-style";
import PageLayout from "@/components/layout/page-layout";
import SEO from "@/next-seo.config";
import { useApollo } from "@/lib/apollo/client";
import StateProvider from "@/context";

const { destroyAll } = Modal;

const App = ({ Component, pageProps }) => {
  const { initialApolloState, session } = pageProps;

  moment.locale("ru");
  Spin.setDefaultIndicator(<LoadingOutlined />);

  const client = useApollo(initialApolloState);
  const { events } = useRouter();

  useEffect(() => {
    const handleModalsOnRouteChange = () => destroyAll();

    events.on("routeChangeStart", handleModalsOnRouteChange);

    return () => {
      events.off("routeChangeStart", handleModalsOnRouteChange);
    };
  }, []);

  return (
    <StateProvider>
      <Provider {...{ session }}>
        <ApolloProvider {...{ client }}>
          <ConfigProvider {...{ locale }}>
            <GlobalStyle />
            <DefaultSeo {...SEO} />
            <PageLayout>
              <Component {...pageProps} />
            </PageLayout>
          </ConfigProvider>
        </ApolloProvider>
      </Provider>
    </StateProvider>
  );
};

export default App;
