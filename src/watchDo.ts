import chokidar from "chokidar";
import { spawn } from "child_process";
import { WatchState } from "./WatchState";

export const watchDo = ({
  path, cmd, parentState,
}: {
  path: string | string[];
  cmd: string;
  parentState: WatchState;
}): WatchState => {
  const watchState: WatchState = {
    error: false,
    busy: false,
    doAfter: undefined,
  };

  const doWork = () => {
    watchState.busy = true;
    const child = spawn(`${cmd}`, {
      shell: true,
      stdio: "inherit",
    });
    child.on("close", (code) => {
      if (code !== 0) {
        watchState.error = true;
        return;
      }
      watchState.busy = false;
      watchState.error = false;
      if (watchState.doAfter !== undefined) {
        const doAfter = watchState.doAfter;
        watchState.doAfter = undefined;
        doAfter();
      }
    });
  };

  const processChange = () => {
    if (watchState.busy && !watchState.error) {
      return;
    }
    if (parentState.busy) {
      parentState.doAfter = doWork;
    } else {
      if (parentState.doAfter === undefined) {
        doWork();
      }
    }
  };

  chokidar
    .watch(path, {
      persistent: true,
      ignoreInitial: true,
    })

    .on("change", processChange)
    .on("add", processChange);
  return watchState;
};
