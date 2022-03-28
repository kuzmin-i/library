import { Space, Typography } from "antd";

import FilterLink from "@/components/book/filter-link";

const { Text, Paragraph } = Typography;

const AboutAuthors = ({ authors }) => (
  <Space direction="vertical">
    <Text type="secondary">{`Об автор${
      authors?.length > 1 ? "ах" : "е"
    }:`}</Text>
    {authors?.map((author) => {
      const { id, name, about } = { ...author?.author };

      return (
        <Text key={id}>
          <Text strong>
            <FilterLink pathname="/catalog" query={{ author: id }}>
              {name}
            </FilterLink>
          </Text>
          <Paragraph
            ellipsis={{
              rows: 3,
              expandable: true,
              symbol: "Читать далее",
            }}
          >
            {about}
          </Paragraph>
        </Text>
      );
    })}
  </Space>
);

export default AboutAuthors;
