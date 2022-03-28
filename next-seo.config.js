export const siteTitle = "Электронная библиотека КБ Стрелка";

export default {
  defaultTitle: siteTitle,
  titleTemplate: `%s - ${siteTitle}`,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    site_name: siteTitle,
  },
  // dangerouslySetAllPagesToNoIndex: true,
  dangerouslySetAllPagesToNoFollow: true,
};
