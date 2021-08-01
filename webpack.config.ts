import path from "path";
import webpack, { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { merge } from "webpack-merge";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import createElectronReloadWebpackPlugin from "electron-reload-webpack-plugin";

export const PATHS = {
    src: path.join(__dirname, "./src"),
    dist: path.join(__dirname, "./app/dist"),
    global: path.resolve(__dirname, "./src/styles/globals.scss"),
    assets: "assets/",
    nodeModules: path.resolve(__dirname, "./node_modules"),
    app: path.resolve(__dirname, "./app")
};

const isProduction = process.env.NODE_ENV === "production";
const mode = isProduction ? "production" : "development";

module.exports = () => {
    const commonPlugins = [
        new HtmlWebpackPlugin({
            template: `${PATHS.src}/index.html`,
            filename: "./index.html",
            title: "Demo",
            publicPath: isProduction ? "./" : ""
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: []
        }),
        new webpack.ProgressPlugin(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(mode),
            "process.env.DEBUG": JSON.stringify(process.env.DEBUG)
        }),
        new ForkTsCheckerWebpackPlugin()
    ];

    const devPlugins = [
        new webpack.SourceMapDevToolPlugin({
            filename: "[file].map"
        }),
        createElectronReloadWebpackPlugin()()
    ];

    const plugins = [...commonPlugins, ...(isProduction
        ? []
        : devPlugins)];

    const devOptions: Configuration = {
        devServer: {
            contentBase: PATHS.dist,
            port: 8085,
            overlay: {
                warnings: false,
                errors: true
            },
            hot: true,
            historyApiFallback: true
        }
    };

    const config: Configuration = {
        mode,
        target: "electron-renderer",
        devtool: isProduction ? "cheap-source-map" : "eval-cheap-module-source-map",
        context: __dirname,
        entry: {
            app: PATHS.src
        },
        resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx", "json", ".css", ".scss", ".svg", ".ignore"]
        },
        module: {
            rules: [{
                test: /\.scss$/,
                include: [PATHS.global],
                use: ["style-loader", "css-loader", "sass-loader"]
            }, {
                test: /\.scss$/,
                exclude: [/node_modules/, PATHS.global],
                use: [
                    "style-loader", {
                        loader: "css-loader",
                        options: {
                            import: true,
                            sourceMap: true,
                            modules: {
                                mode: "local",
                                localIdentName: "[path][name]__[local]--[hash]",
                                exportLocalsConvention: "camelCaseOnly"
                            }
                        }
                    }, {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true,
                            postcssOptions: {
                                config: path.resolve(__dirname, "postcss.config.js")
                            }
                        }
                    }, {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }, {
                test: /\.worker\.ts$/,
                loader: "worker-loader"
            }, {
                test: /\.tsx?$/,
                exclude: [PATHS.nodeModules, PATHS.app],
                use: [{
                    loader: "ts-loader",
                    options: {
                        compilerOptions: {
                            module: "ESNext",
                            removeComments: false
                        }
                    }
                }]
            }, {
                test: /\.(ignore|zip|png|ico|ttf|otf|eot|svg|woff(2)?)(\?[\da-z]+)?$/,
                type: "asset/resource",
                generator: {
                    filename: "static/assets/[name]-[contenthash].[ext]"
                }
            }]
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        name: "vendors",
                        test: /node_modules/,
                        chunks: "all",
                        enforce: true,
                        maxSize: 249_856
                    }
                }
            },
            runtimeChunk: "single",
            moduleIds: "deterministic"
        },
        output: {
            path: PATHS.dist,
            filename: `${PATHS.assets}js/[name]-bundle.[fullhash].js`,
            publicPath: isProduction ? "./" : "/"
        },
        plugins
    };

    return isProduction ? config : merge(config, devOptions);
};
