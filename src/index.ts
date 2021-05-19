import postCss from 'postcss';
import { loadDiagnostic } from './diagnostics';
import * as d from './declarations';
import * as util from './util';


export function postcss(opts: d.PluginOptions = {}): d.Plugin {

  return {
    name: 'postcss',
    pluginType: 'css',
    transform(sourceText: string, fileName: string, context: d.PluginCtx) {
      if (!opts.hasOwnProperty('plugins') || opts.plugins.length < 1) {
        return null;
      }

      if (!context || !util.usePlugin(fileName)) {
        return null;
      }

      const renderOpts = util.getRenderOptions(opts, sourceText, context);

      const results: d.PluginTransformResults = {
        id: util.createResultsId(fileName)
      };

      if (sourceText.trim() === '') {
        results.code = '';
        return Promise.resolve(results);
      }

      return new Promise<d.PluginTransformResults>(resolve => {

        postCss(renderOpts.plugins)
          .process(renderOpts.data, {
            from: fileName
          })
          .then(postCssResults => {
            const warnings = postCssResults.warnings();

            if (warnings.length > 0) {
              // emit diagnostics for each warning
              warnings.forEach((warn: any) => {
                const err: any = {
                  reason: warn.text,
                  level: warn.type,
                  column: warn.column || -1,
                  line: warn.line || -1
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
              results.dependencies = postCssResults.messages
                .filter(message => message.type === 'dependency')
                .map(dependency => dependency.file);

              // write this css content to memory only so it can be referenced
              // later by other plugins (autoprefixer)
              // but no need to actually write to disk
              context.fs.writeFile(results.id, results.code, { inMemoryOnly: true }).then(() => {
                resolve(results);
              });
            }

            return results;
          })
          .catch((err: any) => {
            loadDiagnostic(context, err, fileName);
            results.code = `/**  postcss error${err && err.message ? ': ' + err.message : ''}  **/`;
            resolve(results);
          });
      });
    }
  };
}
