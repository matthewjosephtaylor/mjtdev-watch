import { ChildProcess } from "child_process";

export type WatchState = {
  busy: boolean;
  error: boolean;
  doAfter: () => void;
  child?: ChildProcess
};
