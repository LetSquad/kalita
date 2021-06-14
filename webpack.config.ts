import path from "path";
import webpack, { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { merge } from "webpack-merge";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import ReactRefreshTypeScript from "react-refresh-typescript";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

const PATHS = {
    src: path.join(__dirname, "./src"),
    dist: path.join(__dirname, "./dist"),
    global: path.resolve(__dirname, "./src/styles/globals.scss"),
    assets: "assets/"
};

module.exports = (env: { [key: string]: string | boolean }, argv: { [key: string]: string }) => {
    const isProduction = argv.mode === "production";
    const commonPlugins = [
        new HtmlWebpackPlugin({
            template: `${PATHS.src}/index.html`,
            filename: "./index.html",
            title: "Demo"
        }),
        new CleanWebpackPlugin(),
        new webpack.ProgressPlugin(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": isProduction
                ? JSON.stringify("production")
                : JSON.stringify("development"),
            "process.env.DEBUG": JSON.stringify(process.env.DEBUG)
        }),
        new ForkTsCheckerWebpackPlugin()
    ];

    const devPlugins = [
        new webpack.SourceMapDevToolPlugin({
            filename: "[file].map"
        }),
        new ReactRefreshWebpackPlugin()
    ];

    const devOptions: Configuration = {
        mode: "development",
        devtool: "eval-cheap-module-source-map",
        devServer: {
            contentBase: PATHS.dist,
            port: 8085,
            overlay: {
                warnings: false,
                errors: true
            },
            hot: true,
            open: true,
            historyApiFallback: true
        }
    };

    const prodOptions: Configuration = {
        mode: "production",
        devtool: "cheap-source-map",
        devServer: {
            contentBase: PATHS.dist,
            port: 8085,
            overlay: {
                warnings: false,
                errors: true
            },
            hot: true,
            open: true,
            historyApiFallback: true
        }
    };

    const plugins = [...commonPlugins, ...(isProduction
        ? []
        : devPlugins)];

    const config: Configuration = {
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
                        loader: "dts-css-modules-loader",
                        options: {
                            namedExport: true,
                            dropEmptyFile: true
                        }
                    }, {
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
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use:
                    [{
                        loader: "ts-loader",
                        options: {
                            compilerOptions: {
                                module: "ESNext",
                                removeComments: false
                            },
                            getCustomTransformers: () => ({
                                before: isProduction
                                    ? []
                                    : [ReactRefreshTypeScript()]
                            })
                        }
                    }]
            }, {
                test: /\.(ignore|zip|png|ttf|otf|eot|svg|woff(2)?)(\?[\da-z]+)?$/,
                use:
                    [{
                        loader: "file-loader",
                        options: {
                            name: "[path][name]-[contenthash].[ext]",
                            outputPath: "static/assets/"
                        }
                    }]
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
            publicPath: "/"
        },
        plugins
    };

    return merge<Configuration>(config, isProduction
        ? prodOptions
        : devOptions);
};
