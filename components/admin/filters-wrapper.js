import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { FILTER_OPTIONS_QUERY } from "@/lib/apollo/queries";
import { useQuery } from "@apollo/client";
import Filters from "./filters";

import Container from "@/components/layout/container";

const Wrapper = styled.div`
  position: fixed;
  bottom: 90px;
  width: 100%;

  z-index: 101;

  &&[data-visible="true"] {
    display: block;
  }

  &&[data-visible="false"] {
    display: none;
  }
`;

const BlockWrapper = styled.div`
  width: 100%;
  max-width: 900px;

  padding: 20px 20px;

  background: white;
  box-shadow: 0px 0px 26px 2px rgba(0, 0, 0, 0.25);

  &&&& * {
    font-size: 12px;
  }
`;

const FiltersWrapper = ({ visible = false, openFilterPanel, section }) => {
  const { data = {}, loading } = useQuery(FILTER_OPTIONS_QUERY, {});

  const { authors, catalogs } = { ...data };

  const PanelRef = useRef();

  useEffect(() => {
    if (PanelRef && PanelRef.current) {
      const clickOutside = window.addEventListener("click", (e) => {
        if (!PanelRef.current.contains(e.target)) openFilterPanel(false);
      });

      return () => {
        window.removeEventListener("click", clickOutside);
      };
    }
  }, [PanelRef]);

  /*if (!visible) return <></>;*/

  return (
    <Wrapper data-visible={visible ? "true" : "false"}>
      <Container>
        <BlockWrapper ref={PanelRef}>
          <Filters
            {...{ authors, catalogs, section }}
            onReset={() => console.log("filters were removed")}
          />
        </BlockWrapper>
      </Container>
    </Wrapper>
  );
};

export default FiltersWrapper;
