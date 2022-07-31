export * from '@stencil/core/internal';

export interface PluginOptions {
  injectGlobalPaths?: string[];
  plugins?: any[];
  alwaysParseNonCachedCss?: boolean;
}

export interface RendererOptions {
  data: string;
  plugins: any[];
}
