import styled from "styled-components";

import Image from "@/components/image";

const BookImage = styled(({ large, ...props }) => <Image {...props} />)`
  padding: ${({ large }) => (large ? 1 : 0.5)}rem !important;
  background-color: var(--color-grey);
`;

export default BookImage;
