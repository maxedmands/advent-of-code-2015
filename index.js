import chalk from "chalk";
import _ from "lodash";
import { parseFile } from "./text-parsing.js";

async function main() {
  const ast = await parseFile({
    path: "./input.txt",
    lexemes: [
      { type: "dimension", re: /\d+/, value: (d) => parseInt(d) },
      { type: "x", re: /x/, ignore: true },
      { type: "separator", re: /\n/, ignore: true },
    ],
    grammar: {
      boxList: {
        syntax: [["box", "separator", "boxList"], ["box"]],
        value: (l) => _(l.parts).map("value").sum(),
      },
      box: {
        syntax: [["dimension", "x", "dimension", "x", "dimension"]],
        value: (b) => {
          const [l, w, h] = _.map(b.parts, "value");
          const areas = [l * w, w * h, h * l];
          const slack = Math.min(...areas);
          return slack + _.sum(areas.map((a) => a * 2));
        },
      },
    },
    entry: "boxList",
  });

  console.log(ast.value);
}

function log() {
  console.log(...arguments);
}

const startDate = new Date();
log(
  // random so it's easier to see that something changed in the console:
  _.repeat("\n", _.random(1, 4))
);
log(
  chalk.underline(
    [
      startDate.getHours().toString().padStart(2, 0),
      startDate.getMinutes().toString().padStart(2, 0),
      startDate.getSeconds().toString().padStart(2, 0),
    ].join(":") + _.repeat(" ", 50)
  )
);

main()
  .catch((error) => log(`\n\n${error.stack}`))
  .finally(() => log(`Done in ${Date.now() - startDate.valueOf()}ms`));
