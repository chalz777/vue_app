//module.exports = ({ options }) => {
//  const plugins = [];
//  if (options.env === 'production') plugins.push(require('cssnano'));
//  return {
//      plugins: plugins
//  };
//};

module.exports = {
    plugins: [
        require('autoprefixer')({
            'browsers': ['> 1%', 'last 2 versions']
        })
    ]
};