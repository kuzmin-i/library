import Key from "@/components/book/key";
import { arrToString } from "@/lib/helpers";

const CatalogsKeys = ({ catalogs, ...props }) =>
  catalogs?.length > 0 &&
  catalogs.filter(({ catalog }) => catalog?.key).length > 0 && (
    <Key {...props}>
      {arrToString(
        catalogs,
        ({ catalog }) => catalog?.key,
        ({ catalog }) => `[${catalog?.key}]`
      )}
    </Key>
  );

export default CatalogsKeys;
