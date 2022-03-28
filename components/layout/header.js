import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/client";
import { useLazyQuery } from "@apollo/client";
import { Avatar, Menu, Space, Typography, Grid, Image } from "antd";
import {
  CloseOutlined,
  DownOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styled from "styled-components";

import Container from "@/components/layout/container";
import Logo from "../../public/assets/icons/logo.svg";
import LogoM from "../../public/assets/icons/logo-m.svg";
import { MY_BOOKS_QUERY } from "@/lib/apollo/queries";
import { siteTitle } from "@/next-seo.config";

import UserStricter from "../admin/user-stricter";

const { useBreakpoint } = Grid;
const { SubMenu } = Menu;
const { Link } = Typography;

const HeaderContainer = styled(Container)`
  .ant {
    &-avatar {
      background-color: var(--color-grey-dark);
    }

    &-menu {
      display: flex;
      width: 100%;

      &.ant-menu-dark .ant-menu-item-selected {
        background-color: transparent;
      }

      &-sub {
        .ant-menu-dark .ant-menu-item > a {
          color: var(--color-black);
        }
      }

      & .ant-menu-submenu {
        &-active,
        &-open {
          color: var(--color-white);
        }
      }

      &-item svg {
        height: 0.875rem;
        width: auto;
        vertical-align: -0.125rem;
      }
    }
  }
`;

const HeaderInner = styled.div`
  margin: 0 -1.25rem;
  width: calc(100% + 2.5rem);
`;

const HeaderLink = styled(Link)`
  &.ant-typography,
  .ant-typography {
    color: inherit;

    :active,
    :focus {
      color: rgba(255, 255, 255, 0.65);
    }
  }
`;

const MenuLink = ({ route, title, ...props }) => (
  <Menu.Item key={route} {...props}>
    <NextLink href={`/${route}`}>
      <HeaderLink>{title}</HeaderLink>
    </NextLink>
  </Menu.Item>
);

const AdminLink = ({ route, title, ...props }) => (
  <Menu.Item key={route} {...props}>
    <NextLink href={`/${route}`}>
      <HeaderLink>{title}</HeaderLink>
    </NextLink>
  </Menu.Item>
);

const AccountTitle = ({ image, name, arrow }) => {
  const initials =
    name && (typeof name === "string" || name instanceof String) ? (
      name
        .split(" ")
        .map((name) => name.charAt(0).toUpperCase())
        .join("")
    ) : (
      <UserOutlined style={{ marginRight: 0 }} />
    );

  return (
    <Space align="center">
      <Avatar
        src={
          <Image
            src={image}
            alt={name}
            height={32}
            width={32}
            preview={false}
          />
        }
        style={{ verticalAlign: "-0.625rem" }}
      >
        {initials}
      </Avatar>
      {name}
      {arrow && <DownOutlined />}
    </Space>
  );
};

const SignOut = (props) => (
  <Menu.Item key="sign-out" {...props}>
    <HeaderLink
      onClick={(e) => {
        e.preventDefault();
        return signOut();
      }}
    >
      Выйти
    </HeaderLink>
  </Menu.Item>
);

const Header = ({ user, userId, isAuthorized }) => {
  const { name, image } = { ...user };

  const { pathname } = useRouter();
  const current = ["catalog", "book"].some((path) => pathname.includes(path))
    ? "catalog"
    : pathname.split("/").filter((path) => path !== "")?.[0];

  const { sm = true, md = true } = useBreakpoint();
  const [visible, setVisible] = useState(false);

  const [getMyBooks] = useLazyQuery(MY_BOOKS_QUERY);

  const onMouseEnter = () =>
    userId &&
    getMyBooks({
      variables: { userId },
    });

  return (
    <HeaderContainer>
      <HeaderInner>
        <Menu
          selectedKeys={[current]}
          mode="horizontal"
          theme="dark"
          triggerSubMenuAction={sm ? "hover" : "click"}
          onOpenChange={(openKeys = []) =>
            setVisible(openKeys.includes("dropdown"))
          }
        >
          <Menu.Item key="main" style={{ marginRight: "auto" }}>
            <NextLink href="/" passHref>
              <HeaderLink title={siteTitle}>
                {md ? <Logo alt={siteTitle} /> : <LogoM alt={siteTitle} />}
              </HeaderLink>
            </NextLink>
          </Menu.Item>
          {isAuthorized &&
            (sm ? (
              <>
                {
                  <UserStricter link>
                    <AdminLink route="admin" title="Админ панель" />
                  </UserStricter>
                }

                <MenuLink route="rules" title="Правила" />
                <SubMenu
                  key="account"
                  title={<AccountTitle {...{ image, name }} arrow />}
                >
                  <MenuLink
                    route="account"
                    title="Мои книги"
                    {...{ onMouseEnter }}
                  />
                  <Menu.Divider />
                  <SignOut />
                </SubMenu>
              </>
            ) : (
              <SubMenu
                key="dropdown"
                title={visible ? <CloseOutlined /> : <MenuOutlined />}
                popupOffset={[0, 0]}
                popupClassName="mobile-menu"
              >
                <Menu.ItemGroup
                  key="account"
                  title={<AccountTitle {...{ image, name }} />}
                >
                  <MenuLink
                    route="account"
                    title="Мои книги"
                    {...{ onMouseEnter }}
                  />
                  <MenuLink route="rules" title="Правила" />
                  <Menu.Divider />
                  <SignOut />
                </Menu.ItemGroup>
              </SubMenu>
            ))}
        </Menu>
      </HeaderInner>
    </HeaderContainer>
  );
};

export default Header;
