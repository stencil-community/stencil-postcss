import * as d from './declarations';
import * as path from 'path';


export function usePlugin(fileName: string) {
  return /(\.css|\.pcss)$/i.test(fileName);
}

export function getRenderOptions(opts: d.PluginOptions, sourceText: string, context: d.PluginCtx) {
  const renderOpts: Partial<d.RendererOptions> = {
    plugins: opts.plugins || []
  };

  // always set "data" from the source text
  renderOpts.data = sourceText || '';

  const injectGlobalPaths = Array.isArray(opts.injectGlobalPaths) ? opts.injectGlobalPaths.slice() : [];

  if (context && injectGlobalPaths.length > 0) {
    // automatically inject each of these paths into the source text
    const injectText = injectGlobalPaths.map(injectGlobalPath => {
      if (!path.isAbsolute(injectGlobalPath) && context.config.rootDir) {
        // convert any relative paths to absolute paths relative to the project root
        injectGlobalPath = path.join(context.config.rootDir, injectGlobalPath);
      }

      return `@import "${injectGlobalPath}";`;
    }).join('');

    renderOpts.data = injectText + renderOpts.data;
  }

  return renderOpts;
}


export function createResultsId(fileName: string) {
  // create what the new path is post transform (.css)
  const pathParts = fileName.split('.');
  pathParts[pathParts.length - 1] = 'css';
  return pathParts.join('.');
}
