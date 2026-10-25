const path = require('path');

module.exports = {
  style: {
    postcss: {
      mode: 'extends',
      loaderOptions: (postcssLoaderOptions) => {
        postcssLoaderOptions.postcssOptions.plugins = [
          require('@tailwindcss/postcss'),
        ];
        return postcssLoaderOptions;
      },
    },
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};