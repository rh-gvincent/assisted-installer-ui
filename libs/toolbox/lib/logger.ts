import { chalk } from "zx";

export const info = (...args: any[]) => console.log(chalk.cyan(...args));
export const warn = (...args: any[]) => console.log(chalk.yellow(...args));
export const error = (...args: any[]) => console.log(chalk.redBright(...args));
