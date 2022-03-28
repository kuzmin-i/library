import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import jwt from "jsonwebtoken";

import { authClient } from "@/lib/apollo/client";
import { AUTH_QUERY } from "@/lib/apollo/queries";
import { checkIsExpired } from "@/lib/helpers";

let gqlAccessToken;

const requestAccessToken = async (accessToken, provider = "google") => {
  if (accessToken) {
    const res = await authClient.query({
      query: AUTH_QUERY,
      variables: { provider, accessToken },
    });
    const { access_token } = { ...res?.data?.token };

    if (access_token) {
      gqlAccessToken = access_token;
      console.log('AT', access_token)
    } else {
      console.error(res?.error);
    }
  }
};

const handleToken = (
  token,
  userId,
  accessToken,
  initialProvider,
  initialProviderToken
) => {
  const { provider, providerToken } = { ...token };

  return {
    ...token,
    ...(userId ? { userId } : {}),
    ...(accessToken ? { accessToken } : {}),
    provider: initialProvider || provider,
    providerToken: initialProviderToken || providerToken,
  };
};

const options = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationUrl:
        "https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code",
      scope:
        "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    }),
  ],
  secret: process.env.SECRET,
  session: {
    jwt: true,
    // maxAge: 3 * 24 * 60 * 60
  },
  callbacks: {
    signIn: async (user, account, profile) => {
      const { provider, accessToken } = { ...account };
      const { email, verified_email } = { ...profile };

      await requestAccessToken(accessToken, provider);

      return (
        (gqlAccessToken &&
          provider === "google" &&
          verified_email === true
            // && email.endsWith("@strelka-kb.com")
        ) || "/auth/error"
      );
    },
    jwt: async (token, _, account) => {
      const { provider: initialProvider, accessToken: initialProviderToken } = {
        ...account,
      };
      const { accessToken, provider, providerToken } = { ...token };

      if (gqlAccessToken || accessToken) {
        const { exp, hasura_claims } = {
          ...jwt.decode(gqlAccessToken || accessToken),
        };
        const { "x-hasura-user-id": userId } = { ...hasura_claims };
        const isExpired = checkIsExpired(exp);

        if (isExpired || !accessToken) {
          if (isExpired) {
            await requestAccessToken(providerToken, provider);
          }

          return handleToken(
            token,
            userId,
            gqlAccessToken,
            initialProvider,
            initialProviderToken
          );
        } else {
          return token;
        }
      } else {
        return token;
      }
    },
    session: async (session, token) => {
      const { accessToken, userId } = { ...token };

      return {
        ...session,
        ...(userId && { userId }),
        ...(accessToken && { accessToken }),
      };
    },
  },
  jwt: {
    encryption: true,
    signingKey: process.env.JWT_SIGNING_KEY,
    encryptionKey: process.env.JWT_ENCRYPTION_KEY,
  },
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-out",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
    newUser: null,
  },
  theme: "light",
};

export default NextAuth(options);
