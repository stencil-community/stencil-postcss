import * as postCss from 'postcss';


module.exports = function postcss(
  options: { plugins?: Array<postCss.AcceptedPlugin> } = {}
) {
  return {
    transform: function(sourceText: string, id: string, context: PluginCtx) {
      if (!options.hasOwnProperty('plugins') || options.plugins.length < 1) {
        return null;
      }

      if (!context || !usePlugin(id)) {
        return null;
      }

      const results: PluginTransformResults = {};
      results.id = id

      if (sourceText.trim() === '') {
        results.code = '';
        return Promise.resolve(results);
      }

      return postCss(options.plugins)
        .process(sourceText, {
          from: id
        })
        .then(async postCssResults => {
          const warnings = postCssResults.warnings().map(warn => {
            return `${warn.type}: ${warn.text}`;
          });

          if (warnings.length > 0) {
            results.code = `/**  postcss error${warnings.join(', ')}  **/`;

          } else {
            results.code = postCssResults.css;
            await context.fs.writeFile(results.id, results.code, {inMemoryOnly: true});
          }

          return results;
        });
    },
    name: 'postcss'
  };
};

function usePlugin(id: string) {
  return /(.css)$/i.test(id);
}

export interface PluginTransformResults {
  code?: string;
  id?: string;
}

export interface PluginCtx {
  fs: any;
}
