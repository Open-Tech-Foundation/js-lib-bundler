import ts from 'typescript';

export default function compileTS(fileNames: string, options = {}) {
  const currentOptions: ts.CompilerOptions = {
    noEmitOnError: true,
    strict: true,
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    outDir: './lib',
    skipLibCheck: true,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    allowSyntheticDefaultImports: true,
  };

  const defaultCompilerHost = ts.createCompilerHost({});
  const program = ts.createProgram(
    [fileNames],
    {
      ...currentOptions,
      ...options,
    },
    defaultCompilerHost
  );
  const emitResult = program.emit();

  const allDiagnostics = ts.sortAndDeduplicateDiagnostics(
    ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
  );

  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      const { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start as number
      );
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        '\n'
      );

      console.error(
        `${diagnostic.file.fileName} (${line + 1},${
          character + 1
        }): ${message}`,
        '\n'
      );
    } else {
      console.log(
        ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
      );
    }
  });

  return emitResult.emitSkipped;
}
