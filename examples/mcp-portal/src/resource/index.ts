import { getDriver } from "../helpers";
const schema = {
  name: "graph-schema",
  uri: "schema://main",
  execute: async (uri: URL) => {
    const driver = getDriver();
    try {
      const result = await driver.query("call gs.procedure.meta.schema()");
      const { schema } = result.table[0];

      return {
        contents: [
          {
            uri: uri.href,
            text: schema,
          },
        ],
      };
    } catch (error: any) {
      return {
        contents: [
          {
            uri: uri.href,
            text: `xxxx: ${error.message}`,
          },
        ],
      };
    }
  },
};

export default { schema };
