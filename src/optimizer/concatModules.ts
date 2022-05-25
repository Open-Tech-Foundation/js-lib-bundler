import { resolve, dirname } from 'path';
import { randomUUID } from 'crypto';
import traverse, { Node } from '@babel/traverse';
import generate from '@babel/generator';
import { ExportNamespaceSpecifier, Program } from '@babel/types';
import * as t from '@babel/types';
import parseJS from './parseJS';

export default function concatModules(
  ast: unknown,
  code: string,
  idMap: Map<string, Record<string, string>>,
  isSource = false
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const modulePath = (ast as Program).loc?.filename;

  if (!idMap.has(modulePath)) {
    idMap.set(modulePath, {});
  }

  let output = '';

  traverse(ast as Node, {
    ImportDeclaration(path) {
      const { ast, code } = parseJS(path.node.source.value + '.js');
      output += concatModules(ast, code, idMap);
    },
  });

  traverse(ast as Node, {
    Program(path) {
      const bindings = Object.keys(path.scope.bindings);
      bindings.forEach((id) => {
        const binding = path.scope.bindings[id];
        if (binding.kind === 'module') {
          const importPath =
            (binding.path.parent as t.ImportDeclaration).source.value + '.js';
          const mapKey = resolve(dirname(modulePath), importPath);

          const idMapObj = idMap.get(mapKey) as Record<string, string>;
          const idMapKey = binding.path.node.imported
            ? binding.path.node.imported.name
            : 'default';
          binding.scope.rename(id, idMapObj[idMapKey]);
        } else {
          binding.scope.rename(id, `_${id}_${randomUUID().slice(-12)}`);
        }
      });
    },
  });

  traverse(ast as Node, {
    ExportNamedDeclaration(path) {
      path.node.specifiers.forEach((s) => {
        const idMapObj = idMap.get(modulePath) as Record<string, string>;
        const exportedName = (s as ExportNamespaceSpecifier).exported.name;
        const localName = (s as ExportNamespaceSpecifier).local.name;
        idMapObj[exportedName] = localName;
      });
      if (!isSource) {
        path.remove();
      }
    },
  });

  traverse(ast as Node, {
    ImportDeclaration(path) {
      path.remove();
    },
  });

  output += generate(ast as Node).code;

  return output + '\n';
}
