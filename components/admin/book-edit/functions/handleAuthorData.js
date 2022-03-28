const handleAuthorData = ({ data, setMainData, setTagsData }) => {
  const { author = {} } = { ...data };

  /* шаг 1 */
  const { name, about, id, cr } = author;
  setMainData(() => {
    return { name, about, id, cr };
  });

  /* шаг 3 */
  const { tags } = author;
  setTagsData({ tags });
};

export { handleAuthorData };
