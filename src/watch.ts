import chokidar from "chokidar";
import { spawn } from "child_process";
const usage = () => {
  console.log("watch path cmd [dir cmd]...");
};

type WatchState = {
  busy: boolean;
  doAfter: () => void;
};

const main = () => {
  const args = process.argv.slice(2);
  if (args.length % 2 !== 0) {
    console.error(`Wrong number of args ${args.length}`)
    usage();
    process.exit(-1);
  }

  let parentState: WatchState = {
    busy: false,
    doAfter: undefined,
  };

  for (let i = 0; i < args.length; i = i + 2) {
    const path = args[i];
    const cmd = args[i + 1];
    parentState = watchDo({ path , cmd, parentState });
  }
};

const watchDo = ({
  path ,
  cmd,
  parentState,
}: {
  path: string;
  cmd: string;
  parentState: WatchState;
}): WatchState => {
  const watchState: WatchState = {
    busy: false,
    doAfter: undefined,
  };

  let working = false;
  const doWork = () => {
    console.log(` performing ${cmd} `);
    watchState.busy = true;
    const child = spawn(`${cmd}`, {
      shell: true,
      stdio: "inherit",
    });
    child.on("close", (code) => {
      if (code === 0) {
        watchState.busy = false;
        if (watchState.doAfter !== undefined) {
          watchState.doAfter();
        }
      }
    });
  };

  chokidar
    .watch(path, {
      persistent: true,
    })
    .on("change", (path) => {
      if (watchState.busy) {
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
