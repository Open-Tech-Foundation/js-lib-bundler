import traverse, { NodePath } from '@babel/traverse';
import {
  Declaration,
  ExportNamedDeclaration,
  Identifier,
  ImportDeclaration,
  VariableDeclaration,
} from '@babel/types';
import parseJS from './parseJS';

export default function modulesImporter(
  importPath: NodePath<ImportDeclaration>
): string {
  console.log(importPath.node);
  const { ast, code } = parseJS(importPath.node.source.value + '.js');

  let out = '';
  importPath.node.specifiers.forEach((specifier) => {
    console.log(specifier);
    traverse(ast, {
      enter(path) {
        console.log(path.node.type);
        if (path.isExportNamedDeclaration()) {
          const declaration = (path.node as ExportNamedDeclaration)
            .declaration as Declaration;
          console.log(declaration);
          if (declaration.type === 'VariableDeclaration') {
            (declaration as VariableDeclaration).declarations.forEach((d) => {
              console.log(d);
              if (specifier.local.name === (d.id as Identifier).name) {
                out += code.slice(
                  declaration.start as number,
                  declaration.end as number
                );
              }
            });
          }
        } else if (path.isExportDefaultDeclaration()) {
          const declaration = path.node.declaration;
          console.log(declaration);
          out += code.slice(
            declaration.start as number,
            declaration.end as number
          );
        }
      },
    });
  });

  return out;
}
