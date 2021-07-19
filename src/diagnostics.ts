import * as d from './declarations';


export function loadDiagnostic(context: d.PluginCtx, postcssError: any, filePath: string) {
  if (!postcssError || !context) {
    return;
  }

  const level = postcssError.level === 'warning' ? 'warn' : postcssError.level || 'error';

  const diagnostic: d.Diagnostic = {
    level,
    type: 'css',
    language: 'postcss',
    header: `postcss ${level}`,
    code: postcssError.status && postcssError.status.toString(),
    relFilePath: null,
    absFilePath: null,
    messageText: postcssError.reason || postcssError.message || JSON.stringify(postcssError),
    lines: []
  };

  if (filePath) {
    diagnostic.absFilePath = filePath;
    diagnostic.relFilePath = formatFileName(context.config.rootDir, diagnostic.absFilePath);
    diagnostic.header = formatHeader('postcss', diagnostic.absFilePath, context.config.rootDir, postcssError.line);

    if (postcssError.line > -1) {
      try {
        const sourceText = context.fs.readFileSync(diagnostic.absFilePath);
        const srcLines = sourceText.split(/(\r?\n)/);

        const errorLine: d.PrintLine = {
          lineIndex: postcssError.line - 1,
          lineNumber: postcssError.line,
          text: srcLines[postcssError.line - 1],
          errorCharStart: postcssError.column,
          errorLength: 0
        };

        for (let i = errorLine.errorCharStart; i >= 0; i--) {
          if (STOP_CHARS.indexOf(errorLine.text.charAt(i)) > -1) {
            break;
          }
          errorLine.errorCharStart = i;
        }

        for (let j = errorLine.errorCharStart; j <= errorLine.text.length; j++) {
          if (STOP_CHARS.indexOf(errorLine.text.charAt(j)) > -1) {
            break;
          }
          errorLine.errorLength++;
        }

        if (errorLine.errorLength === 0 && errorLine.errorCharStart > 0) {
          errorLine.errorLength = 1;
          errorLine.errorCharStart--;
        }

        diagnostic.lines.push(errorLine);

        if (errorLine.lineIndex > 0) {
          const previousLine: d.PrintLine = {
            lineIndex: errorLine.lineIndex - 1,
            lineNumber: errorLine.lineNumber - 1,
            text: srcLines[errorLine.lineIndex - 1],
            errorCharStart: -1,
            errorLength: -1
          };

          diagnostic.lines.unshift(previousLine);
        }

        if (errorLine.lineIndex + 1 < srcLines.length) {
          const nextLine: d.PrintLine = {
            lineIndex: errorLine.lineIndex + 1,
            lineNumber: errorLine.lineNumber + 1,
            text: srcLines[errorLine.lineIndex + 1],
            errorCharStart: -1,
            errorLength: -1
          };

          diagnostic.lines.push(nextLine);
        }

      } catch (e) {
        console.error(`StylePostcssPlugin loadDiagnostic, ${e}`);
      }
    }

  }

  context.diagnostics.push(diagnostic);
}


function formatFileName(rootDir: string, fileName: string) {
  if (!rootDir || !fileName) return '';

  fileName = fileName.replace(rootDir, '');
  if (/\/|\\/.test(fileName.charAt(0))) {
    fileName = fileName.substr(1);
  }
  if (fileName.length > 80) {
    fileName = '...' + fileName.substr(fileName.length - 80);
  }
  return fileName;
}


function formatHeader(type: string, fileName: string, rootDir: string, startLineNumber: number = null, endLineNumber: number = null) {
  let header = `${type}: ${formatFileName(rootDir, fileName)}`;

  if (startLineNumber !== null && startLineNumber > 0) {
    if (endLineNumber !== null && endLineNumber > startLineNumber) {
      header += `, lines: ${startLineNumber} - ${endLineNumber}`;
    } else {
      header += `, line: ${startLineNumber}`;
    }
  }

  return header;
}


const STOP_CHARS = ['', '\n', '\r', '\t', ' ', ':', ';', ',', '{', '}', '.', '#', '@', '!', '[', ']', '(', ')', '&', '+', '~', '^', '*', '$'];
