import arg from "arg";

export const ARGS = arg(
  {
    "--help": Boolean,
    "-h": "--help",
    "--kill": Boolean,
    "-k": "--kill",
    "--signal": Number,
    "-s": "--signal",
  },
  {
    permissive: true,
  }
);
