import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';

export default function treeShake(str: string) {
  const ast = parse(str, {
    sourceType: 'module',
  });

  traverse(ast, {
    Program(path) {
      const bindings = Object.keys(path.scope.bindings);
      bindings.forEach((id) => {
        if (!path.scope.bindings[id].referenced) {
          path.scope.bindings[id].path.remove();
        }
      });
    },
  });

  return generate(ast).code;
}
