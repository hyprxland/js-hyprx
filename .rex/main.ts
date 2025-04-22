import { task } from "jsr:@dotrex/file@0.0.0-alpha.1";
import { syncProjects, listProjects, filter } from "./tasks/projects.ts";
import { runDnt } from "./tasks/dnt.ts";
import { jsrDir, npmDir, projectRootDir } from "./tasks/paths.ts";
import { parseArgs } from "jsr:@std/cli@1"
import { getConfig, Project } from "./tasks/config.ts";
import { dirname } from "jsr:@std/path@1";
import { basename, resolve } from "node:path";
import { expandGlobSync } from "jsr:@std/fs@1";
import { blue } from "jsr:@std/fmt@1/colors";
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
            console.log("")
            console.log(blue("### FMT JSR ###"));
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

        if (node) {
            console.log("")
            console.log(blue("### FMT NPM ###"));

            const cmd = new Deno.Command("deno", {
                args: ["fmt", ".", "--line-width", "100", "indent-width", "4", "--ignore=node_modules,**/*.md"],
                stdout: "inherit",
                stderr: "inherit",
                cwd: npmDir,
            })

            const o = await cmd.output();
            if (o.code !== 0) {
                throw new Error("Failed to format the npm code");
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
        let bun = true;
        let args : string[] = ctx.args ?? [];
        const config = getConfig();
        const parsed = parseArgs(args, {
            boolean: ["deno", "jsr", "node", "all"],   
        })

        args = parsed._ as string[];

        if (args.includes("--jsr") || args.includes("--deno")) {
            args = args.filter((a) => a !== "--jsr" && a !== "--deno");
            node = false;
            bun = false;
        }

        if (ctx.args && ctx.args.includes("--node")) {
            args = args.filter((a) => a !== "--node");
            deno = false;
            bun = false;
        }

        console.log("deno", deno, "node", node, "bun", bun);
        const globs = args.filter((a) => a.includes("*") || a.endsWith(".ts"));
        const projectsNames = args.filter(a => !globs.includes(a));
        let projects : Array<Project> = [];
        if (!parsed.all) {
            if (projectsNames.length > 0) {
                projects = await filter(config.projects, projectsNames, false);
             } else {
                projects = await filter(config.projects, undefined, true);
             }
        } else {
            projects = config.projects;
        }


        if (deno) {
            console.log("### DENO TESTS ###");

            if (globs.length === 0) {
                for (const project of projects) {
                    if (project.denoConfig) {
                        const dir = basename(project.dir);
                        globs.push(`${dir}/**/*.test.ts`);
                    }
                }
            }

            const cmd = new Deno.Command("deno", {
                args: ["test", "-A", ...globs],
                stdout: "inherit",
                stderr: "inherit",
                cwd: jsrDir,
            });
            const o = await cmd.output();
            if (o.code !== 0) {
                throw new Error("Failed to run the tests");
            }
        }

        if (node) {
            console.log("")
            console.log("### NODE TESTS ###");
            globs.length = 0;
            for (const project of projects) {
                if (project.packageJson) {
                    
                    const dir = dirname(project.packageJson)
                    const base = basename(dir);
                    globs.push(`${base}/**/*.test.js`);
                }
            }

            const cmd = new Deno.Command("node", {
                args: ["--test", ...globs],
                stdout: "inherit",
                stderr: "inherit",
                cwd: npmDir,
            });
            const o = await cmd.output();
            if (o.code !== 0) {
                throw new Error("Failed to run the tests");
            }
            
        }

        if (bun) {
            console.log("")
            console.log("")
            console.log("### BUN TESTS ###");
            for (const project of projects) {
                if (project.packageJson) {
                    console.log("")
                    console.log(blue("# " + (project.id ?? project.name)));
                    const dir = dirname(project.packageJson)
                    for (const fi of expandGlobSync("**/*.test.js",  { includeDirs: false, root: dir })) {
                        const cmd = new Deno.Command("bun", {
                            args: ["test", fi.path],
                            stdout: "inherit",
                            stderr: "inherit",
                            cwd: resolve(projectRootDir, dir),
                        });
                        const o = await cmd.output();
                        if (o.code !== 0) {
                            
                            console.error("Failed to run the tests");
                            Deno.exit(1);
                        }
    
                        console.log("")
                    }
                }
            }
        }


    }
})