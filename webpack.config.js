const path = require("path")

module.exports = {
  entry: "./src/app.ts",
  output: {
    filename: "bundle.js", // OR "bundle.[contenthash].js" to tell webpack to create hashed bundles that help the browser with cache-ing
    path: path.resolve(__dirname, "dist"), // tell webpack to create an absolute path to the output folder which is the dist folder
  },
  devtool: "inline-source-map", // tell wepack to connect some generated sourcemaps with the bundle it produces
  // tell webpack how to deal with typescript files
  module: {
    rules: [
      {
        test: /\.ts$/, // check for files that end with ".ts"
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
}
