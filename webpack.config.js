const path = require("path"); // Path es un modulo nativo de Node.js, sirve para trabajar con rutas de archivos y directorios
const HtmlWebpackPlugin = require("html-webpack-plugin"); // Plugin para generar un archivo HTML
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // Plugin para extraer CSS a archivos separados
const CopyPlugin = require("copy-webpack-plugin"); // Plugin para copiar archivos y carpetas
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); // Plugin para minimizar CSS
const TerserPlugin = require("terser-webpack-plugin"); // Plugin para minimizar JS
const Dotenv = require("dotenv-webpack"); // Plugin para establecer variables de entorno
// const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // Plugin para limpiar la carpeta dist

module.exports = {
  // Exportamos un objeto con la configuración de Webpack
  entry: "./src/index.js", // Entry es el punto de entrada de nuestra aplicación
  output: {
    // Output es donde Webpack va a colocar el código que genera
    path: path.resolve(__dirname, "dist"), // Path es la ruta donde se va a colocar el código generado, en este caso en la carpeta dist, __dirname es una variable que contiene la ruta del archivo actual
    filename: "[name].[contenthash].js", // Filename es el nombre del archivo que se va a generar
    assetModuleFilename: "assets/images/[hash][ext][query]", // AssetModuleFilename permite establecer el nombre del archivo que se va a generar, en este caso se va a generar un hash con la extensión del archivo original
    // Un hash es un número que se genera a partir de un string, este número es único y se utiliza para identificar de forma única a un archivo
    clean: true, // Clean permite establecer si se va a limpiar la carpeta dist antes de generar el código
  },
  resolve: {
    // Resolve permite establecer las extensiones que va a leer Webpack
    extensions: [".js"], // En este caso solo vamos a leer archivos con extensión .js
    alias: {
      // Alias permite establecer alias para rutas
      "@utils": path.resolve(__dirname, "src/utils/"), // En este caso estamos estableciendo un alias para la ruta src/utils/
      "@templates": path.resolve(__dirname, "src/templates/"), // En este caso estamos estableciendo un alias para la ruta src/templates/
      "@styles": path.resolve(__dirname, "src/styles/"), // En este caso estamos estableciendo un alias para la ruta src/styles/
      "@images": path.resolve(__dirname, "src/assets/images/"), // En este caso estamos estableciendo un alias para la ruta src/assets/images/
    },
  },
  module: {
    // Module permite establecer reglas para los archivos
    rules: [
      // Rules es un arreglo de objetos, cada objeto es una regla
      {
        test: /\.m?js$/, // Test permite identificar los archivos que se van a leer, en este caso solo los archivos que terminen en .js
        exclude: /node_modules/, // Exclude permite omitir archivos o carpetas, en este caso omitimos la carpeta node_modules
        use: {
          // Use permite establecer que loader se va a encargar del archivo
          loader: "babel-loader", // Babel loader es un loader que permite transpilar el código JS moderno a JS compatible con navegadores antiguos
        },
      },
      {
        test: /\.css|.styl$/i, // Test permite identificar los archivos que se van a leer, en este caso solo los archivos que terminen en .css o .styl
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader", // Use permite establecer que loader se va a encargar del archivo, en este caso vamos a usar dos loaders, el primero es para extraer el CSS a archivos separados y el segundo es para interpretar el código CSS
          "stylus-loader",
        ],
      },
      {
        test: /\.png/, // Test permite identificar los archivos que se van a leer, en este caso solo los archivos que terminen en .png
        type: "asset/resource", // Type permite establecer el tipo de módulo que se va a generar, en este caso un recurso
      },
      {
        test: /\.(woff|woff2)$/, // Test permite identificar los archivos que se van a leer, en este caso solo los archivos que terminen en .woff o .woff2
        use: {
          loader: "url-loader", // Url loader es un loader que permite importar archivos como módulos
          options: {
            limit: 10000, // Limit permite establecer un límite en el tamaño del archivo, en este caso si el archivo es menor a 10kb se va a convertir en un módulo, de lo contrario se va a copiar
            mimetype: "application/font-woff", // Mimetype permite establecer el tipo de archivo que se va a generar, en este caso un archivo WOFF
            name: "[name].[contenthash].[ext]", // Name permite establecer el nombre del archivo que se va a generar
            outputPath: "./assets/fonts/", // OutputPath permite establecer la ruta de salida del archivo
            publicPath: "../assets/fonts/", // PublicPath permite establecer la ruta pública del archivo
            esModule: false, // EsModule permite establecer si se va a generar un módulo ES
            // Un modulo ES es un archivo que se puede importar en otro archivo JS como un módulo
          },
        },
      },
    ],
  },
  plugins: [
    //Plugins permite establecer funcionalidades adicionales
    new HtmlWebpackPlugin({
      //Este plugin permite generar un archivo HTML
      inject: true, // Inject permite establecer si se van a inyectar los scripts al archivo HTML
      template: "./public/index.html", // Template es la ruta del archivo HTML que se va a generar
      filename: "./index.html", // Filename es el nombre del archivo HTML que se va a generar
    }),
    new MiniCssExtractPlugin({
      filename: "assets/[name].[contenthash].css", // Filename permite establecer el nombre del archivo CSS que se va a generar
    }), // Este plugin permite extraer el CSS a archivos separados
    new CopyPlugin({
      // Este plugin permite copiar archivos y carpetas
      patterns: [
        // Patterns es un arreglo de objetos, cada objeto es un archivo o carpeta que se va a copiar
        {
          from: path.resolve(__dirname, "src", "assets/images"), // From es la ruta de los archivos que se van a copiar
          to: "assets/images", // To es la ruta de destino de los archivos
        },
      ],
    }),
    new Dotenv(), // Este plugin permite establecer variables de entorno
    // new CleanWebpackPlugin(), // Este plugin permite limpiar la carpeta dist
  ],
  optimization: {
    // Optimization permite establecer opciones de optimización
    minimize: true, // Minimize permite establecer si se va a minimizar el código
    minimizer: [
      // Minimizer es un arreglo de plugins que se van a encargar de minimizar el código
      new CssMinimizerPlugin(), // Este plugin permite minimizar CSS
      new TerserPlugin(), // Este plugin permite minimizar JS
    ],
  },
};
