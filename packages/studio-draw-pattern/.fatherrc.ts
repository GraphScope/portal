import { defineConfig } from "father";

export default defineConfig({
  esm: {
    input: "src",
    output: "./dist/esm",
    transformer: "swc",
  },
});
