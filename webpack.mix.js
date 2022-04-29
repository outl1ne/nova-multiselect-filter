let mix = require('laravel-mix');
let path = require('path');

mix
  .setPublicPath('dist')
  .js('resources/js/filter.js', 'js')
  .vue({ version: 3 })
  .webpackConfig({
    externals: {
      vue: 'Vue',
    },
    output: {
      uniqueName: 'outl1ne/nova-multiselect-filter',
    },
  })
  .alias({
    'laravel-nova-filterable': path.join(__dirname, 'vendor/laravel/nova/resources/js/mixins/Filterable.js'),
    'laravel-nova-interacts-with-query-string': path.join(
      __dirname,
      'vendor/laravel/nova/resources/js/mixins/InteractsWithQueryString.js'
    ),
  });
