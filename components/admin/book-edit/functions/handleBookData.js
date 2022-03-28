import { getIdFromObject } from "./functions";

const handleBookData = ({
  data,
  setMainData,
  setSettingsData,
  setTagsData,
  setThumbData,
}) => {
  if (data) {
    const { book = {} } = { ...data };
    const {
      authors: originAuthors,
      publishers: originPublishers,
      catalogs: originCatalogs,
    } = book;

    const authors = getIdFromObject(originAuthors, "authors"); /* id's */
    const publishers = getIdFromObject(originPublishers, "publishers");
    const catalogs = getIdFromObject(originCatalogs, "catalogs");

    /* шаг 1 */
    const { name, about, id, cr } = book;
    setMainData((state) => {
      return { name, about, id, cr, authors, publishers };
    });

    /* шаг 2 */
    const { lang, isbn, year, first_publish_year, pages, url } = book;

    setSettingsData(() => ({
      catalogs,
      lang,
      isbn,
      year,
      first_publish_year,
      pages,
      url,
      publishers,
    }));

    /* шаг 3 */
    const { tags } = book;
    setTagsData({ tags });

    const { thumb } = book;
    console.log("thumb", thumb);
    setThumbData({ thumb });
  }

  return;
};

export { handleBookData };
