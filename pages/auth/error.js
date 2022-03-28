import Link from "next/link";
import { Button, Result } from "antd";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import {getPageUrl} from "@/lib/helpers";

const AuthError = () => {
  const { query } = useRouter();
  const { error } = { ...query };

  const messages = {
    Configuration: {
      title: "Ошибка сервера",
      subTitle: "Проблема с конфигурацией сервера",
    },
    AccessDenied: { title: "Доступ запрещен", subTitle: "У вас нет доступа" },
    Verification: {
      title: "Не удалось войти",
      subTitle:
        "Ссылка для входа больше не действительна. Возможно, он уже использовалась или срок её действия истек.",
    },
    Default: { title: "Ошибка" },
  };
  const { Default } = { ...messages };
  const { title, subTitle } = { ...(messages?.[error] || Default) };

  return (
    <>
      <NextSeo
        {...{ title }}
        description={subTitle || false}
        noindex={true}
        openGraph={{
          title,
          description: subTitle,
          url: getPageUrl(),
        }}
      />
      <Result
        {...{ title, subTitle }}
        status="warning"
        extra={
          <Link href="/auth/sign-in" passHref>
            <Button type="primary">Войти</Button>
          </Link>
        }
      />
    </>
  );
};

export default AuthError;
