export * from '@stencil/core/internal';

export interface PluginOptions {
  injectGlobalPaths?: string[];
  plugins?: any[];
}

export interface RendererOptions {
  data: string;
  plugins: any[];
}
