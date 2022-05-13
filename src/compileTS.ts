import { join } from 'path';
import ts from 'typescript';

export default function compileTS(source: string, options = {}) {
  const currentOptions: ts.CompilerOptions = {
    noEmitOnError: true,
    strict: true,
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    outDir: '.bundler',
    skipLibCheck: true,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    allowSyntheticDefaultImports: true,
    allowJs: true,
  };

  const host = ts.createCompilerHost(currentOptions);
  host.getCurrentDirectory = () => process.cwd();
  host.writeFile = (fileName: string, data: string) => {
    return ts.sys.writeFile(join(process.cwd(), fileName), data);
  };
  const program = ts.createProgram(
    [join(process.cwd(), source)],
    currentOptions,
    host
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
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      console.log(
        ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
      );
    }
  });

  return emitResult.emitSkipped;
}
