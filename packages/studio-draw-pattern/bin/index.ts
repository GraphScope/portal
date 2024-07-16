#! /usr/bin/env bun

import { Command } from "commander";
import type { Edge } from "../types/edge";
import type { Node } from "../types/node";
import generateEdge from "../utils/cypher/generateEdge";
import generateMATCH from "../utils/cypher/generateMATCH";
import generateNode from "../utils/cypher/generateNode";
import deconstructMATCH from "../utils/deconstructCypher/deconstructMATCH";

const program = new Command();
program
  .name("GenerateQuery")
  .version("0.01")
  .description("generate Cypher&Gremlin with design GPE JSON");

program
  .command("generate")
  .description("generate query language with pointed JSON file")
  .argument("<string>", "JSON file path")
  .option("--cypher", "generate cypher language")
  .option("--gremlin", "generate gremlin language, Not developed yet.")
  .action(async (str: string) => {
    const file = Bun.file(str);
    const content = await file.text();
    const contentJSON = JSON.parse(content);
    let nodesArray: Node[] = [];
    let edgesArray: Edge[] = [];
    let laguages: string[] = [];
    let MATCHs: string[] = [];
    // 生成相关的node节点
    nodesArray = generateNode(contentJSON.nodes, contentJSON.variables);
    edgesArray = generateEdge(contentJSON.relations, contentJSON.variables);
    MATCHs = generateMATCH(nodesArray, edgesArray, contentJSON.variables);
    const language = MATCHs.join("\n");
    console.log(language);
  });

program
  .command("deconstruct")
  .description("deconstruct query language and put the JSON to point file")
  .argument("<string>", "language sentence")
  .argument("<string>", "write file path")
  .option("--cypher", "deconstruct cypher language")
  .option("--gremlin", "deconstruct gremlin language, Not developed yet.")
  .action(async (language: string, writePath: string) => {
    const totalJSON = await deconstructMATCH(language);
    await Bun.write(writePath, totalJSON);
  });

program.parse();

// import deconstructMATCH from "./utils/deconstructCypher/deconstructMATCH";
//
// //
// deconstructMATCH(
//   "MATCH (:Person {name: 'Anna'})-[r:KNOWS WHERE r.since < 2020]->(friend:Person)",
// );
