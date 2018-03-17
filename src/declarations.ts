export interface PluginOptions {
  injectGlobalPaths?: string[];
  plugins?: Array<any>;
}

export interface PluginTransformResults {
  code?: string;
  id?: string;
}

export interface RendererOptions {
  data: string;
  plugins: Array<any>;
}

export interface PluginCtx {
  config: {
    rootDir: string;
    srcDir: string;
  };
  fs: any;
  diagnostics: Diagnostic[];
}

export interface Diagnostic {
  level: 'error' | 'warn' | 'info' | 'log' | 'debug';
  type: string;
  header?: string;
  messageText: string;
  language?: 'javascript' | 'typescript' | 'postcss' | 'css';
  code?: string;
  absFilePath?: string;
  relFilePath?: string;
  lines?: PrintLine[];
}

export interface PrintLine {
  lineIndex: number;
  lineNumber: number;
  text?: string;
  html?: string;
  errorCharStart: number;
  errorLength?: number;
}
