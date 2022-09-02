import { WatchState } from "./WatchState";
import { watchDo } from "./watchDo";
import { usage } from "./usage";
import { ARGS } from "./ARGS";

export const main = () => {
  if (ARGS["--help"]) {
    usage();
    process.exit(0);
  }

  const pathCommandPairs = ARGS._;
  if (pathCommandPairs.length % 2 !== 0) {
    console.error(
      `Invalid number of path command pairs: ${pathCommandPairs.length}`
    );
    usage();
    process.exit(-1);
  }

  let parentState: WatchState = {
    error: false,
    busy: false,
    doAfter: undefined,
  };

  for (let i = 0; i < pathCommandPairs.length; i = i + 2) {
    const path = pathCommandPairs[i].split(",").map((s) => s.trim());
    const cmd = pathCommandPairs[i + 1];
    parentState = watchDo({ path, cmd, parentState });
  }
};
