module.exports = {
  entry: './src/umd.js',
  output: {
    filename: 'collection-json.js',
    path: __dirname + '/dist'
  },
  node: {
       fs: "empty"
  }
}
