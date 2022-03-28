import { useRouter } from "next/router";
import styled from "styled-components";
import moment from "moment";
import { Button, Col, Collapse, Form, Grid, Input, Row } from "antd";
import Icon, { SearchOutlined } from "@ant-design/icons";
import { MdTune } from "@react-icons/all-files/md/MdTune";

import { useStateContext } from "@/context";
import Container from "@/components/layout/container";
import { handleQueryArr, isNotBlankStr } from "@/lib/helpers";
import { useEffect, useState } from "react";
import Filters from "@/components/books-catalog/filters";
import MobileFilters from "@/components/books-catalog/mobile-filters";
import { mediaSm } from "@/styles/theme/breakpoints";
import { TOGGLE_FILTERS } from "@/context/reducer";

const { useBreakpoint } = Grid;
const { useForm } = Form;
const { Panel } = Collapse;

export const SearchContainer = styled(Container)`
  padding-top: 3rem;
  padding-bottom: 3rem;
  background-color: var(--color-grey);

  ${mediaSm} {
    position: ${({ sticky }) => sticky && "sticky"};
    top: 3rem;
    z-index: 99;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }

  .ant {
    &-collapse {
      > .ant-collapse-item > .ant-collapse-header {
        padding: 0 1rem 0 1.5rem;
        font-weight: 700;

        .ant-collapse-arrow {
          padding: 0;
          left: 0;
        }
      }

      &-ghost
        > .ant-collapse-item
        > .ant-collapse-content
        > .ant-collapse-content-box {
        padding: 1rem 0;
      }
    }
  }
`;

const SearchRow = styled(Row)`
  .ant-form-item {
    margin-bottom: 0;
  }
`;

const SearchInputRow = styled(Row)`
  .ant {
    &-btn-primary {
      ${mediaSm} {
        border-radius: 0 0.125rem 0.125rem 0;
      }
    }

    &-input {
      &,
      &-affix-wrapper {
        ${mediaSm} {
          border-radius: 0.125rem 0 0 0.125rem;
          border-right-width: 0;

          :hover {
            border-right-width: 0 !important;
          }
        }
      }

      &-prefix {
        margin-right: 0.5rem;
        color: rgba(0, 0, 0, 0.45);
      }
    }

    &-form-item {
      margin-bottom: 0;
    }
  }
`;

const FiltersButton = styled(({ active, ...props }) => <Button {...props} />)`
  &.ant-btn-icon-only {
    padding: 0;
    width: 1.375rem;
    height: 1.375rem;
    font-size: 0.875rem;
    color: ${({ active }) =>
      active ? "var(--color-black)" : "rgba(0, 0, 0, 0.45)"};

    :hover,
    :focus {
      color: var(--color-black);
    }

    ${mediaSm} {
      width: 1.5rem;
      height: 1.5rem;
      font-size: 1rem;
    }
  }
`;

const SearchBar = ({ authors, catalogs, filters }) => {
  const { state, dispatch } = useStateContext();
  const { isFiltersOpen } = { ...state };

  const toggleFilters = (payload) =>
    dispatch({ type: TOGGLE_FILTERS, payload });

  const { push, query } = useRouter();
  const { sm = true } = useBreakpoint();

  const [form] = useForm();
  const { setFieldsValue } = { ...form };

  const { query: search, author, year, sort, lang, slug } = { ...query };
  const [, catalog] = slug || [];

  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    !sm && setDrawerVisible(false);
  }, [sm]);

  useEffect(() => {
    setFieldsValue({
      query: search,
      catalog: catalog || "all",
      author: author || "all",
      ...(year && { year: moment(year) }),
      lang: lang || "all",
      sort: sort || "default",
    });
  }, [search, catalog, author, year, sort, lang]);

  const initialValues = {
    author: "all",
    catalog: "all",
    sort: "default",
    lang: "all",
  };

  const handleQueryPush = (pathname, query, shallow) =>
    push(
      {
        pathname,
        query,
      },
      undefined,
      { shallow }
    );

  const handleFilters = (filters) => {
    const { catalog, query, author, year, lang, sort, shallow = true } = {
      ...filters,
    };

    return handleQueryPush(
      `/catalog`,
      {
        ...(isNotBlankStr(handleQueryArr(query)) && { query }),
        ...(author && author !== "all" && { author }),
        ...(year && { year: moment(year).format("YYYY") }),
        ...(lang && lang !== "all" && { lang }),
        ...(sort && sort !== "default" && { sort }),
      },
      shallow
    );
  };

  return (
    <SearchContainer sticky={filters} wide>
      <Container>
        <Form
          {...{ form, initialValues }}
          size={sm ? "middle" : "large"}
          name="search"
          layout="vertical"
          onValuesChange={(changedValues, allValues) =>
            sm &&
            !changedValues.hasOwnProperty("query") &&
            handleFilters({
              ...allValues,
              shallow: !changedValues.hasOwnProperty("catalog"),
            })
          }
          onFinish={(values) => handleFilters(values)}
        >
          <SearchRow gutter={16}>
            <Col flex="auto">
              <SearchInputRow gutter={sm && 16} wrap={false}>
                <Col flex="auto">
                  <Form.Item name="query" style={{ flex: "auto" }}>
                    <Input
                      prefix={sm && <SearchOutlined />}
                      suffix={
                        filters && (
                          <FiltersButton
                            icon={<Icon component={MdTune} />}
                            type="text"
                            htmlType="button"
                            active={sm ? isFiltersOpen : drawerVisible}
                            onClick={() =>
                              sm
                                ? toggleFilters(!isFiltersOpen)
                                : setDrawerVisible(!drawerVisible)
                            }
                          />
                        )
                      }
                      placeholder={`Введите название книги${
                        sm ? ", имя автора или ISBN" : ""
                      }`}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      {sm ? "Искать" : <SearchOutlined />}
                    </Button>
                  </Form.Item>
                </Col>
              </SearchInputRow>
            </Col>
          </SearchRow>
          {filters &&
            (sm ? (
              <Collapse activeKey={isFiltersOpen && ["1"]} ghost>
                <Panel key="1" showArrow={false}>
                  <Filters
                    {...{ visible: isFiltersOpen, authors, catalogs }}
                    onReset={() => handleFilters({ shallow: !catalog })}
                  />
                </Panel>
              </Collapse>
            ) : (
              <MobileFilters
                {...{ form, initialValues, authors, catalogs }}
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                onFinish={(values) => {
                  const { catalog: newCatalog } = { ...values };

                  return handleFilters({
                    query: search,
                    shallow:
                      newCatalog === catalog ||
                      (!catalog && newCatalog === "all"),
                    ...values,
                  });
                }}
              />
            ))}
        </Form>
      </Container>
    </SearchContainer>
  );
};

export default SearchBar;
