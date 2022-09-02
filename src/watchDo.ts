import chokidar from "chokidar";
import { spawn } from "child_process";
import { WatchState } from "./WatchState";
import { getChildSignalOnChangeMaybe } from "./getChildSignalOnChangeMaybe";

export const watchDo = ({
  path,
  cmd,
  parentState,
}: {
  path: string | string[];
  cmd: string;
  parentState: WatchState;
}): WatchState => {
  const watchState: WatchState = {
    error: false,
    busy: false,
    doAfter: undefined,
    child: undefined,
  };

  const childSignalOnChangeMaybe = getChildSignalOnChangeMaybe();

  const doWork = () => {
    watchState.busy = true;
    const child = spawn(`${cmd}`, {
      shell: true,
      stdio: "inherit",
    });
    watchState.child = child;
    child.on("close", (code) => {
      watchState.child = undefined;

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
    if (
      watchState.child !== undefined &&
      childSignalOnChangeMaybe !== undefined
    ) {
      watchState.child.kill(childSignalOnChangeMaybe);
      watchState.busy = false;
    }

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
