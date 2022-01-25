//@ts-check

import { createStore } from "actus-react";

function add({ state, payload }: { state: number; payload: number }): number {
  return state + payload;
}

export const { actions, useSelector } = createStore({
  state: {
    number: 0,
    numberWithOnlyDefaultActions: 0,
    nested: {
      string: "",
    },
  },

  actions: {
    number: {
      add,
      addInline({ state, payload }) {
        return state + payload;
      },

      invalid: {
        // @ts-expect-error
        invalid: ({ state }) => state,
      },
    },

    nested: {
      string: {
        addString({ state, payload }) {
          return state + payload;
        },
      },
    },

    global: ({ state }) => state,
  },
});

// Success:
const wholeState = useSelector();
const nested = useSelector(
  (state) => state.nested,
  (previousState, newState) => previousState === newState
);
const nestedString = useSelector((state) => state.nested.string);
actions.merge({ foo: "bar" });
actions.number.set(123);
actions.numberWithOnlyDefaultActions.set(123);
actions.nested.string.concat("456");
actions.global();
actions.number.add(456);
actions.number.addInline(456);
actions.nested.string.addString("456");

// Errors expected:
// @ts-expect-error
actions.foo.set(123);
// @ts-expect-error
actions.foo.add(456);
// @ts-expect-error
useSelector((state) => state.foo);
