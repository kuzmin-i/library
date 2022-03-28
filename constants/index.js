import { Space } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";

export const bookErrors = {
  AA00_BACKBOOK: "Вы не брали эту книгу",
  AA01_TAKEBOOK: "Книга недоступна в данный момент",
  AA02_TAKEBOOK: "Вы превысили лимит книг",
};

export const languages = [
  { label: "Русский", value: "ru" },
  { label: "Английский", value: "en" },
  // { label: "Нидерландский", value: "nl" },
  // { label: "Китайский", value: "ch" },
  // { label: "Японский", value: "jp" },
  // { label: "Польский", value: "pl" },
  // { label: "Французский", value: "fr" },
  // { label: "Немецкий", value: "de" },
  { label: "Другой", value: "other" },
];

const alphabetically = "По алфавиту";
const byYear = "По году";
const orderByOptions = [
  { label: alphabetically, value: "name_asc", icon: <SortAscendingOutlined /> },
  {
    label: alphabetically,
    value: "name_desc",
    icon: <SortDescendingOutlined />,
  },
  { label: byYear, value: "year_desc", icon: <ArrowDownOutlined /> },
  { label: byYear, value: "year_asc", icon: <ArrowUpOutlined /> },
];

export const orderBy = orderByOptions.map(({ label, value, icon }) => ({
  value,
  label,
  children: (
    <Space>
      {label}
      {icon}
    </Space>
  ),
}));

export const ogImageUrl = `${
  process.env.NEXT_PUBLIC_DOMAIN || ""
}/assets/images/og.png`;
