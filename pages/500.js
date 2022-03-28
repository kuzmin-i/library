import ErrorPage from "@/components/layout/error-page";

const Error500 = () => {
  const title = "500";
  const subTitle = "Внутренняя ошибка сервера";

  return <ErrorPage {...{ title, subTitle }} />;
};

export default Error500;
