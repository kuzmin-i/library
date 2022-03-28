import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/client";

import ErrorPage from "../layout/error-page";

const UserStricter = ({ children, link = false }) => {
  const [allowAccess, setAccess] = useState(false);

  const [session] = useSession();

  useEffect(() => {
    const { user } = { ...session };
    const { email } = user;

    switch (email) {
      case "ikuzmin@strelka-kb.com":
        setAccess(true);
        break;
      case "dkumelashvili@strelka-kb.com":
        setAccess(true);
        break;
      case "zhmurova@strelka-kb.com":
        setAccess(true);
        break;
      case "yilicheva@strelka-kb.com":
        setAccess(true);
        break;
      case "tkildigulov@strelka-kb.com":
        setAccess(true);
        break;
    }
  }, [session]);

  if (allowAccess) return <>{children}</>;

  if (!link) {
    const title = "404";
    const subTitle = "Страница, которую вы запросили, не существует";

    return <ErrorPage {...{ title, subTitle }} />;
  }

  return <></>;
};

export default UserStricter;
