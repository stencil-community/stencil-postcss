import postCss from 'postcss';
import { loadDiagnostic } from './diagnostics';
import type * as d from './declarations';
import * as util from './util';
//import path from 'path';
//import glob from 'glob';

export function postcss(opts: d.PluginOptions = {}): d.Plugin {
  return {
    name: 'postcss',
    pluginType: 'css',
    transform(sourceText: string, fileName: string, context: d.PluginCtx) {
      if (!opts.hasOwnProperty('plugins') || opts.plugins.length === 0) {
        return null;
      }

      if (!context || !util.usePlugin(fileName)) {
        return null;
      }

      // Workaround for JIT handling of i.e. Tailwind: Read the source text from the CSS indepent from Stencil,
      // in order to always get the raw input file.
      if(opts.hasOwnProperty('alwaysParseNonCachedCss') && opts.alwaysParseNonCachedCss)
      {
        try {
          sourceText = context.sys.readFileSync(fileName); // Read non-cached variant
        }
        catch(ex)
        {
          console.error("Reading the source CSS file from path " + fileName + " failed");
        }
      }

      const renderOpts = util.getRenderOptions(opts, sourceText, context);

      const results: d.PluginTransformResults = {
        id: util.createResultsId(fileName),
      };

      if (sourceText.trim() === '') {
        results.code = '';
        return Promise.resolve(results);
      }

      return new Promise<d.PluginTransformResults>((resolve) => {
        postCss(renderOpts.plugins)
          .process(renderOpts.data, {
            from: fileName,
          })
          .then((postCssResults) => {
            const warnings = postCssResults.warnings();

            if (warnings.length > 0) {
              // emit diagnostics for each warning
              warnings.forEach((warn: any) => {
                const err: any = {
                  reason: warn.text,
                  level: warn.type,
                  column: warn.column || -1,
                  line: warn.line || -1,
                };

                loadDiagnostic(context, err, fileName);
              });

              const mappedWarnings = warnings
                .map((warn: any) => {
                  return `${warn.type} ${warn.plugin ? `(${warn.plugin})` : ''}: ${warn.text}`;
                })
                .join(', ');

              results.code = `/**  postcss ${mappedWarnings}  **/`;
              resolve(results);
            } else {
              results.code = postCssResults.css.toString();
              results.dependencies = []; // Can be left empty, since JIT with other Frameworks works after using non-cached CSS source.

              resolve(results);
            }
          })
          .catch((err: any) => {
            loadDiagnostic(context, err, fileName);
            results.code = `/**  postcss error${err && err.message ? ': ' + err.message : ''}  **/`;
            resolve(results);
          });
      });
    },
  };
}
