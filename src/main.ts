import { WatchState } from "./WatchState";
import { watchDo } from "./watchDo";
import { usage } from "./usage";

export const main = () => {
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
