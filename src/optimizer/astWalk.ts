import traverse from '@babel/traverse';
import { Node } from '@babel/types';
import modulesImporter from './modulesImporter';

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
          output += modulesImporter(path) + '\n';
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
