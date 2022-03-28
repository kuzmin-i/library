import { render, screen } from "@testing-library/react";
import BookStatus from "@/components/book/book-status";
import { createExpirationDate } from "@/lib/helpers";

const userId = "b3bfc260-c552-11eb-8529-0242ac130003";
const otherUserId = "b8128ed2-c553-11eb-8529-0242ac130003";
const otherUserFirstName = "Petr";
const otherUserLastName = "Petrov";
const createUser = (id, first_name, last_name) => ({
  __typename: "user_hub",
  id,
  meta: [
    {
      __typename: "user_meta_sat",
      first_name,
      last_name,
    },
  ],
});
const user = createUser(userId, "Ivan", "Ivanov");
const otherUser = createUser(
  otherUserId,
  otherUserFirstName,
  otherUserLastName
);
const defaultState = {
  __typename: "book_state_view",
  book_id: "3bd191aa-daeb-b78e-a49f-12d8228ad4f8",
  op_code: 0,
  exp: null,
  user: null,
};
const defaultText = "На полке";
const statuses = [
  {
    name: "available status",
    state: defaultState,
    text: defaultText,
  },
  {
    name: "not available status",
    state: {
      ...defaultState,
      op_code: 1,
      exp: createExpirationDate(),
      user: otherUser,
    },
    text: `На руках у ${otherUserFirstName} ${otherUserLastName}`,
  },
  {
    name: "wrong status",
    state: { ...defaultState, op_code: 2 },
    text: "Неизвестно",
  },
  {
    name: "unset status",
    state: { ...defaultState, op_code: undefined },
    text: defaultText,
  },
  {
    name: "my book status",
    state: {
      ...defaultState,
      op_code: 1,
      exp: createExpirationDate(),
      user,
    },
    text: "В моих книгах",
  },
  {
    name: "loading status",
    state: defaultState,
    text: "Обновление...",
    loading: true,
  },
];

const getStatus = ({ name, state, text, loading }) =>
  it(name, () => {
    render(<BookStatus {...{ state, userId, loading }} />);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

describe("BookStatus", () => {
  statuses.map((status) => getStatus(status));
});
