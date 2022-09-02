#!/usr/bin/env npx ts-node --swc

import { main } from "./main";
(() => {
  try {
    main();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
