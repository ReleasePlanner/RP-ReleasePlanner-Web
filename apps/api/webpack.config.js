const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  resolve: {
    modules: ['node_modules', join(__dirname, '../../node_modules')],
    extensions: ['.ts', '.js', '.json'],
    alias: {
      '@rp-release-planner/rp-shared': join(__dirname, '../../libs/rp-shared/src/index.ts'),
      '@rp-release-planner/shared/types': join(__dirname, '../../libs/shared/types/src/index.ts'),
      '@rp-release-planner/shared/utils': join(__dirname, '../../libs/shared/utils/src/index.ts'),
      '@rp-release-planner/api/common': join(__dirname, '../../libs/api/common/src/index.ts'),
    },
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ["./src/assets"],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
      sourceMaps: true,
    })
  ],
};
