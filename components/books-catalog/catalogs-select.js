import { Space, Tag } from "antd";
import styled from "styled-components";
import Key from "@/components/book/key";

const { CheckableTag } = Tag;

const CategoryTag = styled(CheckableTag)`
  &.ant-tag-checkable {
    margin-bottom: 0.5rem;
    padding: 0.1875rem 0.6875rem;
    border-color: #d9d9d9;

    &,
    ${Key} {
      font-size: 0.875rem;
    }

    ${Key} {
      margin-left: -0.125rem;
      transition: all 0.3s;
    }

    :not(.ant-tag-checkable-checked) {
      background-color: var(--color-white);

      :hover {
        border-color: var(--color-black);
      }
    }

    &-checked {
      border-color: var(--color-black);

      ${Key} {
        color: var(--color-white);
      }

      :hover {
        &,
        ${Key} {
          color: rgba(255, 255, 255, 0.85);
        }
      }
    }
  }
`;

const CatalogsSelect = ({ catalogs, value, onChange }) =>
  catalogs?.map(({ id, name, key }) => (
    <CategoryTag
      key={id}
      checked={id !== "all" && id === value}
      onChange={(checked) => onChange(checked ? id : undefined)}
    >
      <Space size={4}>
        <Key>{`[${key}]`}</Key>
        {name}
      </Space>
    </CategoryTag>
  ));

export default CatalogsSelect;
