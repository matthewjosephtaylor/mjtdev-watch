import chokidar from "chokidar";
import { spawn } from "child_process";
const usage = () => {
  console.log("watch path cmd [dir cmd]...");
};

type WatchState = {
  busy: boolean;
  error: boolean;
  doAfter: () => void;
};

const main = () => {
  const args = process.argv.slice(2);
  if (args.length % 2 !== 0) {
    console.error(`Wrong number of args ${args.length}`);
    usage();
    process.exit(-1);
  }

  let parentState: WatchState = {
    error: false,
    busy: false,
    doAfter: undefined,
  };

  for (let i = 0; i < args.length; i = i + 2) {
    const path = args[i].split(",").map((s) => s.trim());
    const cmd = args[i + 1];
    parentState = watchDo({ path, cmd, parentState });
  }
};

const watchDo = ({
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

  chokidar
    .watch(path, {
      persistent: true,
    })
    .on("change", (path) => {
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
    });
  return watchState;
};

main();
