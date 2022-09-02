import { ARGS } from "./ARGS";


export const getChildSignalOnChangeMaybe = (): number | undefined => {
  return ARGS["--kill"] ? 15 : ARGS["--signal"];
};
