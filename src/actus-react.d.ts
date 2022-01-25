type UnboundAction<StateSlice> = (paramerets: {
  state: StateSlice;
  payload: any;
}) => StateSlice;

type UnboundActions<State> =
  | {
      [Property in keyof State]: UnboundActions<State[Property]>;
    }
  | {
      [key: string]: UnboundAction<State>;
    };

// type BoundObjectActions<State, Actions> = {
//   [Property in keyof State &
//     keyof Actions]: Actions[Property] extends UnboundAction<State>
//     ? (
//         payload: Parameters<Actions[Property]>[0]["payload"]
//       ) => ReturnType<Actions[Property]>
//     : BoundObjectActions<State[Property], Actions[Property]>;
// } & {
//   [Property in keyof Actions]: Actions[Property] extends UnboundAction<State>
//     ? (
//         payload: Parameters<Actions[Property]>[0]["payload"]
//       ) => ReturnType<Actions[Property]>
//     : BoundObjectActions<State, Actions[Property]>;
// };

interface NumberActions {
  set: (payload: number) => void;
  reset: () => void;
  increment: () => void;
  decrement: () => void;
}

interface BooleanActions {
  set: (payload: boolean) => void;
  reset: () => void;
  on: () => void;
  off: () => void;
  toggle: () => void;
}

interface StringActions {
  set: (payload: string) => void;
  reset: () => void;
  clear: () => void;
  concat: (payload: string) => void;
}

interface ObjectActions {
  set: (payload: Record<string, unknown>) => void;
  reset: () => void;
  clear: () => void;
  merge: (payload: Record<string, unknown>) => void;
  mergeDeep: (payload: Record<string, unknown>) => void;
  remove: (payload: string) => void;
}

interface ArrayActions {
  set: (payload: unknown[]) => void;
  reset: () => void;
  clear: () => void;
  append: (payload: any) => void;
  prepend: (payload: any) => void;
  concat: (payload: unknown[]) => void;
}

type BoundActions<State, ActionsT = {}> = State extends Number
  ? NumberActions
  : State extends Boolean
  ? BooleanActions
  : State extends String
  ? StringActions
  : State extends Array<unknown>
  ? ArrayActions
  : State extends Record<string, unknown>
  ? ObjectActions & {
      [Property in keyof State & keyof ActionsT]: BoundActions<
        State[Property],
        ActionsT[Property]
      >;
    } & {
      [Property in keyof State]: BoundActions<State[Property]>;
    }
  : {};

declare module "actus-react" {
  function createStore<State extends any>(config: {
    state: State;
    actions: UnboundActions<State>;
  }): {
    actions: BoundActions<typeof config["state"], typeof config["actions"]>;

    useSelector: <
      Selector extends (state: State) => any = (state: State) => State
    >(
      selector?: Selector,
      isEqual?: (
        previousState: ReturnType<Selector>,
        newState: ReturnType<Selector>
      ) => boolean
    ) => ReturnType<Selector>;
  };
}
