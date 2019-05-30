import * as d from '../src/declarations';
import * as util from '../src/util';


describe('getRenderOptions', () => {

  const sourceText = 'body { color: blue; }';
  const fileName = '/some/path/file-name.scss';
  const context: d.PluginCtx = {
    config: {
      rootDir: '/Users/my/app/',
      srcDir: '/Users/my/app/src/',
    },
    fs: {},
    diagnostics: []
  };
  const dummyPlugin = () => null;


  it('should inject plugins array and not change input options', () => {
    const input: d.PluginOptions = {
      plugins: [dummyPlugin]
    };
    const output = util.getRenderOptions(input, sourceText, context);
    expect(output.plugins).toHaveLength(1);
    expect(output.plugins[0]).toBe(dummyPlugin);
    expect(input.plugins).toHaveLength(1);
    expect(input.plugins[0]).toBe(dummyPlugin);
  });

  it('should inject global postcss array and not change input options or include globals in output opts', () => {
    const input: d.PluginOptions = {
      injectGlobalPaths: ['/my/global/variables.pcss']
    };
    const output = util.getRenderOptions(input, sourceText, context);
    expect(output.data).toBe(`@import "/my/global/variables.pcss";body { color: blue; }`);
    expect(input.injectGlobalPaths).toHaveLength(1);
    expect(input.injectGlobalPaths[0]).toBe('/my/global/variables.pcss');
  });

  it('should set empty options by default', () => {
    const input = {};
    const output = util.getRenderOptions(input, undefined, context);
    expect(output.data).toBe('');
    expect(output.plugins).toHaveLength(0);
  });

  it('should not break with undefined context', () => {
    const input: d.PluginOptions = {
      injectGlobalPaths: ['./my/global/variables.pcss']
    };

    expect(() => {
      const output = util.getRenderOptions(input, undefined, undefined);
    }).not.toThrow();
  });

});


describe('usePlugin', () => {

  it('should use the plugin for .pcss file', () => {
    const fileName = 'my-file.pcss';
    expect(util.usePlugin(fileName)).toBe(true);
  });

  it('should use the plugin for .css file', () => {
    const fileName = 'my-file.css';
    expect(util.usePlugin(fileName)).toBe(true);
  });

  it('should not use the plugin for .scss file', () => {
    const fileName = 'my-file.scss';
    expect(util.usePlugin(fileName)).toBe(false);
  });

  it('should not use the plugin for .less file', () => {
    const fileName = 'my-file.less';
    expect(util.usePlugin(fileName)).toBe(false);
  });

});

describe('createResultsId', () => {

  it('should change pcss the extension to be css', () => {
    const input = '/my/path/my-file.pcss';
    const output = util.createResultsId(input);
    expect(output).toBe('/my/path/my-file.css');
  });

});
