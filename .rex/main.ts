import { task } from "jsr:@dotrex/file@0.0.0-alpha.1";
import { syncProjects, listProjects } from "./tasks/projects.ts";
import { runDnt } from "./tasks/dnt.ts";
import { jsrDir } from "./tasks/paths.ts";
import { existsSync } from "node:fs";
task("default", () => {
    console.log("Hello from Hyprx!"); 
});

task({
    id: "projects:sync",
    description: "Sync projects to the config",
    async run() {
        await syncProjects();
    },
});

task({
    id: "dnt",
    description: "Build the npm package",
    async run() {
        await runDnt();
    }
})

task({
    id: "projects:list",
    description: "List all projects",
    run() {
        listProjects
    },
});

task({
    id: "fmt",
    description: "Format the jsr code",
    async run(ctx) {
        let deno = true;
        let node = true;
        if (ctx.args && ctx.args.includes("--jsr") || ctx.args?.includes("--deno")) {
            node = false;
        }

        if (ctx.args && ctx.args.includes("--node")) {
            deno = false;
        }

        console.log("deno", deno, "node", node);

        if (deno) {
            const cmd = new Deno.Command("deno", {
                args: ["fmt"],
                stdout: "inherit",
                stderr: "inherit",
                cwd: jsrDir,
            });
            const o = await cmd.output();
            if (o.code !== 0) {
                throw new Error("Failed to format the jsr code");
            }
        }
    }
});

task({
    "id": "lint",
    "description": "Lint the jsr code",
    async run(ctx) {
        let deno = true;
        let node = true;
        if (ctx.args && ctx.args.includes("--jsr") || ctx.args?.includes("--deno")) {
            node = false;
        }

        if (ctx.args && ctx.args.includes("--node")) {
            deno = false;
        }

        console.log("deno", deno, "node", node);
        
        if (deno) {
            const cmd = new Deno.Command("deno", {
                args: ["lint"],
                stdout: "inherit",
                stderr: "inherit",
                cwd: jsrDir,
            });
            const o = await cmd.output();
            if (o.code !== 0) {
                throw new Error("Failed to lint the jsr code");
            }
        }
    }
});

task({
    id: "test",
    description: "Run the tests",
    async run(ctx) {
        let deno = true;
        let node = true;
        let args : string[] = ctx.args ?? [];
        if (args.includes("--jsr") || args.includes("--deno")) {
            args = args.filter((a) => a !== "--jsr" && a !== "--deno");
            node = false;
        }

        if (ctx.args && ctx.args.includes("--node")) {
            args = args.filter((a) => a !== "--node");
            deno = false;
        }

        console.log("deno", deno, "node", node);

        if (deno) {
            const tests = args.filter(o => {
                if (!o.startsWith("jsr/")) {
                    if (!o.startsWith("npm/")) {
                        const test = `jsr/${o}`;
                        return existsSync(test);
                    } else {
                        return false;
                    }
                }


                return existsSync(o);
            }).map((a) => {
            
                if (a.includes(".ts")) {
                    return a;
                }

                return `${a}/**/*.test.ts`;
            });

            const cmd = new Deno.Command("deno", {
                args: ["test", "-A", ...tests],
                stdout: "inherit",
                stderr: "inherit",
                cwd: jsrDir,
            });
            const o = await cmd.output();
            if (o.code !== 0) {
                throw new Error("Failed to run the tests");
            }
        }
    }
})