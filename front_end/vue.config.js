const path = require('path');
module.exports = {
  configureWebpack: {
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    module: {
      rules: [
        {
          test: /\.json$/,
          include: [path.resolve(__dirname, 'src', 'assets', 'monster')],
          use: 'file-loader',
          type: 'javascript/auto'
        }
      ]
    }
  }
};
