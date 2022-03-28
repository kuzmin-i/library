import { useEffect } from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/client";
import jwt from "jsonwebtoken";
import styled from "styled-components";
import { Layout } from "antd";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PageLoading from "@/components/layout/page-loading";
import PageRedirect from "@/components/layout/page-redirect";
import { checkIsExpired } from "@/lib/helpers";
import CookiesMessage from "@/components/layout/cookies-message";

const Container = styled(Layout)`
  min-height: 100%;

  &,
  .ant-layout-content {
    display: flex;
    flex-direction: column;
  }

  .ant-layout {
    &-header {
      position: sticky;
      top: 0;
      z-index: 100;
    }
    &-content {
      flex-grow: 1;
    }
  }
`;

const PageLayout = ({ children }) => {
  const { isFallback, push, pathname, asPath } = useRouter();
  const [session, loading] = useSession();

  const { user, userId, accessToken } = { ...session };
  const { exp } = {
    ...jwt.decode(accessToken),
  };
  const isExpired = checkIsExpired(exp);
  const isAuthorized = user && accessToken && !isExpired;
  const isAuthPage = pathname.startsWith("/auth");
  const isMainPage = asPath === "/";

  useEffect(() => {
    if (typeof window !== "undefined" && !loading) {
      if (!isAuthPage && !isAuthorized) {
        signOut({ redirect: false }).catch((err) => err);

        return push({
          pathname: "/auth/sign-in",
          ...(!isMainPage && { query: { callbackUrl: window.location.href } }),
        });
      }
      if (isAuthPage && isAuthorized) {
        return push("/");
      }
    }
  }, [isAuthPage, isAuthorized, isMainPage, loading]);

  return (
    <Container>
      <Layout.Header>
        <Header {...{ user, userId, isAuthorized }} />
      </Layout.Header>
      <Layout.Content>
        {isFallback || loading || (isAuthPage && isAuthorized) ? (
          <PageLoading />
        ) : !loading && !isAuthPage && !isAuthorized ? (
          <PageRedirect />
        ) : (
          children
        )}
      </Layout.Content>
      <Layout.Footer>
        <Footer />
      </Layout.Footer>
      {isAuthorized && <CookiesMessage />}
    </Container>
  );
};

export default PageLayout;
