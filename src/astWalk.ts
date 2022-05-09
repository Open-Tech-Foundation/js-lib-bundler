import { join } from "path";
import traverse from "@babel/traverse";
import parseJS from "./parseJS";
import { Node } from "@babel/types";

export default function astWalk(ast: Node, code: string) {
  let output = "";
  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value.startsWith(".")) {
        path.node.specifiers.forEach((n) => {
          const { ast: newAST, code: newCode } = parseJS(
            join("./lib", `${path.node.source.value}.js`)
          );
          output += astWalk(newAST, newCode);
        });
      } else {
        output +=
          code.slice(path.node.start as number, path.node.end as number) + "\n";
      }
    },
    ExportDefaultDeclaration(path) {
      const declaration = path.node.declaration;
      output +=
        code.slice(declaration.start as number, declaration.end as number) +
        "\n";
    },
    ExportNamedDeclaration(path) {
      output += code.slice(path.node.start as number, path.node.end as number);
    },
  });

  return output;
}
