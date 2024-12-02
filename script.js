import { spawn } from "child_process";

const commands = [
  ["npx", ["tsc"]],
  ["npx", ["tsc", "--watch"]],
  [
    "npx",
    [
      "tailwindcss",
      "-i",
      "./public/styles/globals.css",
      "-o",
      "./public/styles/output.css",
      "--watch",
    ],
  ],
  ["node", ["--watch", "./build/index.js"]],
];

commands.forEach(([command, args]) => {
  const child = spawn(command, args, { stdio: "inherit", shell: true });

  child.on("spawn", () => {
    console.log(command, args.join(" "));
  });

  child.on("error", (error) => {
    console.error(`Error running ${command}: ${error.message}`);
  });

  child.on("close", (code) => {
    console.log(`${command} process exited with code ${code}`);
  });
});
