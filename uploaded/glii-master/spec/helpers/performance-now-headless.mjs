// Needed to run performance.now() headless

import { performance as perf } from "perf_hooks";

global.performance = perf;
