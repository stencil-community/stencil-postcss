import type * as d from '../src/declarations';
import { postcss } from '../src/index';
import * as autoprefixer from 'autoprefixer';

describe('postcss', () => {
  const context = {
    config: {
      rootDir: '/Users/my/app/',
      srcDir: '/Users/my/app/src/',
    },
    fs: {
      writeFile: async () => undefined,
      readFileSync: () => undefined,
    },
    diagnostics: [],
  } as unknown as d.PluginCtx;

  it('should return a rollup plugin', () => {
    const plugin = postcss({
      plugins: [],
    });
    expect(plugin.name).toBe('postcss');
    expect(plugin.pluginType).toBe('css');
    expect(typeof plugin.transform).toBe('function');
  });

  it('transform should not modify input code if no config is passed', async () => {
    const plugin = postcss({});

    const input = `:host { color: red; }`;

    const result = await plugin.transform?.(input, 'one.mdx', context);

    expect(result).toBe(null);
  });

  it('transform should not modify input code if file extension does not match', async () => {
    const plugin = postcss({
      plugins: [autoprefixer()],
    });

    const input = `:host { color: red; }`;

    const result = await plugin.transform?.(input, 'one.mdx', context);

    expect(result).toBe(null);
  });

  it('transform should modify input code', async () => {
    const plugin = postcss({
      plugins: [autoprefixer()],
    });

    const input = `:host { color: red; }`;

    const result = await plugin.transform?.(input, 'file.css', context);

    expect(result).toMatchObject({
      code: ':host { color: red; }',
      dependencies: [],
      id: 'file.css',
    });
  });

  it('transform should produce errors in the code result', async () => {
    const consoleSpy = jest.spyOn(console, 'error');
    const plugin = postcss({
      plugins: [autoprefixer()],
    });

    const input = `:host {display: -webkit-box`;

    const result = await plugin.transform?.(input, 'file.css', context);

    expect(consoleSpy).toHaveBeenCalled();

    expect(result).toBeInstanceOf(Object);
    expect((result as d.PluginTransformResults).code).toContain('/**  postcss error: ');
  });
});
