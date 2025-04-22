// terrible hack to get all the internals to be included in the bundle
// when using dnt to transform ts to npm/js.
import {} from "./args.ts";
import {} from "./internal/args.ts";
import {} from "./internal/exit_0.ts";
import {} from "./internal/exit_1.ts";
import {} from "./internal/read_stdin.ts";
import {} from "./internal/write_stderr.ts";
import {} from "./internal/write_stdout.ts";
import {} from "./internal/read_stdin_async.ts";
