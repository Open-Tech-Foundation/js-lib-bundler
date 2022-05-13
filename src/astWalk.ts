import traverse from '@babel/traverse';
import parseJS from './parseJS';
import { Node } from '@babel/types';

export default function astWalk(ast: Node, code: string, isSource = false) {
  let output = '';
  traverse(ast, {
    enter(path) {
      console.log(path.node.type);

      if (path.isExportDefaultDeclaration()) {
        if (isSource) {
          output +=
            code.slice(path.node.start as number, path.node.end as number) +
            '\n';
        } else {
          const declaration = path.node.declaration;
          output +=
            code.slice(declaration.start as number, declaration.end as number) +
            '\n';
        }

        path.skip();
      } else if (path.isImportDeclaration()) {
        if (path.node.source.value.startsWith('.')) {
          path.node.specifiers.forEach(() => {
            const { ast: newAST, code: newCode } = parseJS(
              path.node.source.value + '.js'
            );
            output += astWalk(newAST, newCode);
          });
        } else {
          output +=
            code.slice(path.node.start as number, path.node.end as number) +
            '\n';
        }

        path.skip();
      } else if (!path.isProgram()) {
        output +=
          code.slice(path.node.start as number, path.node.end as number) + '\n';
        path.skip();
      }
    },
  });

  return output;
}
