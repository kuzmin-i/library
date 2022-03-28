import moment from "moment";

const handleBookForm = ({
  mainData,
  settingsData,
  tagsData,
  /* */
  testMode,
  /* */
  addBook,
  setReadyButton
}) => {
  setReadyButton("loading");
  const changeBtnStatus = setTimeout(() => {
    setReadyButton("error");
  }, 1500);

  const { id: book_id } = mainData;
  const { authors, cr, ..._mainData } = mainData;
  const { publishers, catalogs, ..._settingsData } = settingsData;

  const is_new_type = true;

  const bookMeta = {
    ..._mainData,
    ..._settingsData,
    ...tagsData,
    is_new_type,
    is_visible: true,
    is_available: true,
    cr: cr ? cr : moment().format(),
  };

  const metaCommon = { book_id, is_new_type: true };

  const authorsMeta = authors
    ? authors.map((author_id) => ({
        author_id,
        ...metaCommon,
      }))
    : [];

  const publishersMeta =
    publishers &&
    publishers.map((publisher_id) => ({
      publisher_id,
      ...metaCommon,
    }));

  const catalogMeta = {
    catalog_id: catalogs,
    ...metaCommon,
  };

  const variables = { bookMeta, authorsMeta, publishersMeta, catalogMeta };
  console.log("variables", variables);

  if (!testMode) {
    addBook({
      variables,
    });
  }
};

export { handleBookForm };
