import * as d from '../src/declarations';
import * as util from '../src/util';


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
