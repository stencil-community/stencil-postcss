# @stencil/postcss

This package is used in order to integrate with postcss and all of it's plugins.

First, npm install within the project:

```
npm install @stencil/postcss --save-dev
```

Next, within the project's `stencil.config.js` file, import the plugin and add
it to the config's `plugins` config:

```js
const postcss = require('@stencil/postcss');

// if you want to run autoprefixer
const autoprefixer = require('autoprefixer');
exports.config = {
  plugins: [
    postcss({
      plugins: [autoprefixer()]
    })
  ]
};
```

During development, this plugin will use postcss to process any plugins you may
have passed along

## Options

Postcss has an ecosystem of plugins itself (a plugin for a plugin if you will).
For our example, we're using the autoprefixer plugin, and configuring it's
options. Note, you can pass any valid autoprefixer option.

```js
exports.config = {
  plugins: [
    postcss({
      plugins: [
        autoprefixer({
          browsers: ['last 6 versions'],
          cascade: false
        })
      ]
    })
  ]
};
```

## Related

* [postcss](https://github.com/postcss/postcss)
* [autoprefixer](https://github.com/postcss/autoprefixer)
* [Stencil](https://stenciljs.com/)
* [Stencil Worldwide Slack](https://stencil-worldwide.slack.com)
* [Ionic Components](https://www.npmjs.com/package/@ionic/core)
* [Ionicons](http://ionicons.com/)

## Contributing

Please see our [Contributor Code of
Conduct](https://github.com/ionic-team/ionic/blob/master/CODE_OF_CONDUCT.md) for
information on our rules of conduct.
