import { Typography } from "antd";

import Container from "@/components/layout/container";
import KBLogo from "../../public/assets/icons/kb-logo.svg";

import { useRouter } from "next/router";

const { Link } = Typography;

const Footer = () => {
  const title = "Strelka KB";

  const { pathname } = useRouter();

  if (pathname === "/admin") return <></>;

  return (
    <Container>
      <Link
        {...{ title }}
        href="https://strelka-kb.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <KBLogo alt={title} />
      </Link>
    </Container>
  );
};

export default Footer;
