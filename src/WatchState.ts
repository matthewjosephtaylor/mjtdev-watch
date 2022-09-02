export type WatchState = {
  busy: boolean;
  error: boolean;
  doAfter: () => void;
};
