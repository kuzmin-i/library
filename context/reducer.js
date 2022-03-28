const TOGGLE_FILTERS = "TOGGLE_FILTERS";

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case TOGGLE_FILTERS:
      return {
        ...state,
        isFiltersOpen: payload,
      };
    default:
      return state;
  }
};

export default reducer;
export { TOGGLE_FILTERS };
