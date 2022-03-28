import Link from "next/link";

const FilterLink = ({ children, pathname, query, separated }) => (
  <>
    <Link
      href={{
        pathname,
        query,
      }}
    >
      {children}
    </Link>
    {separated ? ", " : ""}
  </>
);

export default FilterLink;
