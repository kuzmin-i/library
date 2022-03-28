import { createGlobalStyle, css } from "styled-components";

import colors from "./colors";
import { mediaSm } from "@/styles/theme/breakpoints";

const { primary, white, black, grey, greyDark } = colors;

export const animatedLink = css`
  a.ant-typography,
  .ant-typography a {
    text-decoration: underline transparent;
    transition: text-decoration 0.3s ease-in-out;

    :active,
    :hover {
      text-decoration: underline currentColor;
    }
  }
`;

const GlobalStyle = createGlobalStyle`
  :root {
    --color-primary: ${primary};
    --color-white: ${white};
    --color-black: ${black};
    --color-grey: ${grey};
    --color-grey-dark: ${greyDark};
    --font-fallback: -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --font-fugue: "Fugue Mono KB", var(--font-fallback);
  }

  html, body, #__next {
    height: 100%;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  h2.ant-typography,
  .ant-typography h2 {
    margin: 1rem 0 2rem;
    font-family: var(--font-fugue);
    text-transform: uppercase;

    ${mediaSm} {
      margin: 0.5rem 0 1rem;
      font-size: 1.5rem;
    }
  }

  h3.ant-typography,
  .ant-typography h3 {
    margin-bottom: 1rem;
    font-family: var(--font-fugue);
    text-transform: uppercase;

    ${mediaSm} {
      margin-bottom: 0.5rem;
      font-size: 1.25rem;
    }
  }

  .ant {
    &-typography strong,
    &-form-item-label > label,
    &-modal-title,
    &-drawer-title {
      font-weight: 700;
    }

    &-select-item {
      ${mediaSm} {
        font-size: 1rem;
      }
    }

    &-typography ul {
      list-style-type: square;
    }
  }

  .mobile-menu {
    width: 100%;

    &,
    &.ant-menu-submenu > .ant-menu {
      border-radius: 0;
    }

    .ant-menu {
      padding-bottom: 1rem;

      &-item-group {
        &-title {
          padding: 1rem;
        }

        &-list .ant-menu-item {
          padding-left: 1rem;
        }
      }
    }
  }
  
  .take-modal {
    .ant-modal-confirm {
      &-title {
        padding-bottom: 1rem;
        border-bottom: 1px solid #d9d9d9;
      }
      
      &-content {
        margin-top: 0;
        padding-top: 0.5rem;
        max-height: 25rem;
        overflow-y: auto;

        ${animatedLink}
      }
      
      &-btns {
        margin-top: 0;
        padding-top: 1.5rem;
        width: 100%;
        border-top: 1px solid #d9d9d9;
        text-align: right;
      }
    }
  }
`;

export default GlobalStyle;
