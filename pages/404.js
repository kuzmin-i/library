import ErrorPage from "@/components/layout/error-page";

const Error404 = () => {
  const title = "404";
  const subTitle = "Страница, которую вы запросили, не существует";

  return <ErrorPage {...{ title, subTitle }} />;
};

export default Error404;
