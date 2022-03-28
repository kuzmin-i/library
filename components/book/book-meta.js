import { Col, Grid, Row, Space, Typography } from "antd";
import styled from "styled-components";

import { arrToString } from "@/lib/helpers";
import { languages } from "@/constants";
import Key from "@/components/book/key";
import CatalogsKeys from "@/components/book/catalogs-keys";
import BookStatus from "@/components/book/book-status";
import FilterLink from "@/components/book/filter-link";
import { mediaLgUp, mediaSm } from "@/styles/theme/breakpoints";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const Container = styled(Space)`
  width: 100%;

  h1.ant-typography,
  .ant-typography h1 {
    margin-bottom: 0.25em;

    ${mediaSm} {
      font-size: 1.75rem;
    }
  }
`;

const Authors = styled(Text)`
  font-size: 1.25rem;
  line-height: 1.5rem;
`;

const KeysCol = styled(Col)`
  ${mediaLgUp} {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
`;

const KeysContainer = styled(Space)`
  ${mediaLgUp} {
    padding-top: 1rem;
  }
`;

const CatalogKey = styled(CatalogsKeys)`
  ${mediaLgUp} {
    font-size: 3rem;
  }

  ${mediaSm} {
    font-size: 1.25rem;
  }
`;

const BookKey = styled(Key)`
  ${mediaLgUp} {
    font-size: 2.25rem;
  }

  ${mediaSm} {
    font-size: 1.25rem;
  }
`;

const ELink = styled(Text)`
  margin-top: 24px;
  color: rgba(93, 95, 239, 1);
  text-decoration: underline;

  &&[disabled] {
    opacity: 0;
  }
`;

const BookMeta = ({
  name,
  authors = [],
  bookKey,
  year,
  lang = [],
  isbn,
  publishers = [],
  catalogs = [],
  first_publish_year,
  pages,
  state,
  userId,
  loading,
}) => {
  const { lg = true } = useBreakpoint();

  const placeholder = "-";
  const handleMeta = (year, lang, isbn, publishers, catalogs) => [
    {
      name: `Раздел${catalogs?.length > 1 ? "ы" : ""}:`,
      value:
        catalogs?.length > 0
          ? catalogs
              .filter(({ catalog }) => catalog?.name)
              .map(({ catalog }, i) => {
                const { id, name } = { ...catalog };

                return (
                  <FilterLink
                    key={i}
                    pathname="/catalog/[slug]"
                    query={{ slug: id }}
                    separated={i < catalogs.length - 1}
                  >
                    {name}
                  </FilterLink>
                );
              })
          : placeholder,
    },
    {
      name: "Язык:",
      value:
        lang?.length > 0
          ? arrToString(
              lang,
              (lang) => lang,
              (lang) =>
                languages
                  .find(({ value }) => value === lang)
                  ?.label?.toLowerCase() || ""
            )
          : placeholder,
    },

    {
      name: "ISBN:",
      value: isbn || placeholder,
    },
    {
      name: `Издательств${publishers?.length > 1 ? "а" : "о"}:`,
      value:
        publishers?.length > 0
          ? arrToString(publishers, ({ publisher }) => publisher?.name)
          : placeholder,
    },
    {
      name: "Год:",
      value: year || placeholder,
    },
    {
      name: "Год первого издания:",
      value: first_publish_year || placeholder,
    },
    {
      name: "Количество страниц:",
      value: pages || placeholder,
    },
  ];

  const meta = handleMeta(year, lang, isbn, publishers, catalogs);
  const authorsNames = Array.isArray(authors)
    ? authors
        .filter(({ author }) => author?.name)
        .map(({ author }, i) => {
          const { id, name } = { ...author };

          return (
            <FilterLink
              key={i}
              pathname="/catalog"
              query={{ author: id }}
              separated={i < authors.length - 1}
            >
              {name}
            </FilterLink>
          );
        })
    : "";

  return (
    <Container direction="vertical" size={24}>
      <Row gutter={[32, lg ? 16 : 24]}>
        <Col span={24} lg={18}>
          <Space direction="vertical" size={0}>
            <Title>{name}</Title>
            {authors?.length > 0 && <Authors>{authorsNames}</Authors>}
          </Space>
        </Col>
        <KeysCol span={24} lg={6}>
          <KeysContainer
            direction={lg ? "vertical" : "horizontal"}
            size={lg ? 24 : 8}
            align={lg && "end"}
          >
            <CatalogKey {...{ catalogs }} large={!lg} />
            <BookKey large={!lg}>{bookKey}</BookKey>
          </KeysContainer>
        </KeysCol>
      </Row>
      <Space direction="vertical">
        <BookStatus {...{ state, userId, loading }} />
        {meta.map(({ name, value }, i) => (
          <Text key={i}>
            <Space>
              <Text type="secondary">{name}</Text>
              <Text strong>{value}</Text>
            </Space>
          </Text>
        ))}

        <ELink>
          <Space style={{ marginTop: "24px" }}>
            <Text disabled type="secondary">
              Электронная версия книги
            </Text>
          </Space>
        </ELink>
      </Space>
    </Container>
  );
};

export default BookMeta;
