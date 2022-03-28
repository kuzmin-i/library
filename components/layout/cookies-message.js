import { Alert } from "antd";
import styled from "styled-components";

import { useRouter } from "next/router";

const Container = styled(Alert)`
  position: sticky;
  bottom: 0;
  z-index: 99;
  padding: 1rem 1.25rem calc(1rem + env(safe-area-inset-bottom));
  background-color: #d9d9d9;
`;

const CookiesMessage = () => {
  const { pathname } = useRouter();

  if (pathname === "/admin") return <></>;

  return (
    <Container
      type="info"
      message="Мы используем файлы cookie"
      showIcon={false}
      banner
      closable
    />
  );
};

export default CookiesMessage;
