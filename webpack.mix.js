let mix = require('laravel-mix');
let path = require('path');
let postcss = require('postcss-import');
let tailwindcss = require('tailwindcss');

mix
  .setPublicPath('dist')
  .js('resources/js/entry.js', 'js')
  .vue({ version: 3 })
  .webpackConfig({
    externals: {
      vue: 'Vue',
    },
    output: {
      uniqueName: 'outl1ne/nova-multiselect-filter',
    },
  })
  .postCss('resources/css/entry.css', 'dist/css/', [postcss(), tailwindcss('tailwind.config.js')])
  .alias({
    'laravel-nova-filterable': path.join(__dirname, 'vendor/laravel/nova/resources/js/mixins/Filterable.js'),
    'laravel-nova-interacts-with-query-string': path.join(
      __dirname,
      'vendor/laravel/nova/resources/js/mixins/InteractsWithQueryString.js'
    ),
  });
