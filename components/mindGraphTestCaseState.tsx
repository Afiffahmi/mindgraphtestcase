import { createMachine, assign } from "xstate";

const navigationMachine = createMachine({
  id: "navigation",
  initial: "login",
  context: {
    selectedProduct: null,
  },
  states: {
    login: {
      on: {
        CAN_LOGIN: "home",
      },
    },
    home: {
      on: {
        CAN_LOGOUT: "login",
      },
    },
  },
});

export default navigationMachine;
