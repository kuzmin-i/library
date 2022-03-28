const handlePublicationData = ({ data, setMainData, setTagsData }) => {
  const { publisher = {} } = { ...data };

  /* шаг 1 */
  const { name, id, cr } = publisher;
  setMainData(() => {
    return { name, id, cr };
  });

  /* шаг 3 */
  const { tags } = publisher;
  setTagsData({ tags });
};

export { handlePublicationData };
