let path = require('path');
let mix = require('laravel-mix');
let postcss = require('postcss-import');
let tailwindcss = require('tailwindcss');

mix.extend('nova', new require('laravel-nova-devtool'));

mix
  .setPublicPath('dist')
  .js('resources/js/entry.js', 'js')
  .vue({ version: 3 })
  .nova('outl1ne/nova-multiselect-filter')
  .postCss('resources/css/entry.css', 'dist/css/', [postcss(), tailwindcss('tailwind.config.js')])
  .alias({
    'laravel-nova-filterable': path.join(__dirname, 'vendor/laravel/nova/resources/js/mixins/Filterable.js'),
    'laravel-nova-interacts-with-query-string': path.join(
      __dirname,
      'vendor/laravel/nova/resources/js/mixins/InteractsWithQueryString.js'
    ),
  });
