module.exports = {
    // Otras configuraciones de Webpack...
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    // Especifica el archivo de configuración de TypeScript personalizado
    resolve: {
      alias: {
        'typescript': path.resolve(__dirname, 'mi_tsconfig.json'),
      },
    },
  };
  