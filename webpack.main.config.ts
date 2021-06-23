import path from "path";

export const PATHS = {
    electronMain: path.join(__dirname, "./app/main.ts"),
    dist: path.join(__dirname, "./app/dist")
};

const isProduction = process.env.NODE_ENV === "production";
const mode = isProduction ? "production" : "development";

module.exports = {
    mode,
    target: "electron-main",
    entry: {
        app: PATHS.electronMain
    },
    resolve: {
        extensions: [".js", ".ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use:
                    [{
                        loader: "ts-loader",
                        options: {
                            compilerOptions: {
                                module: "commonjs",
                                removeComments: true
                            }
                        }
                    }]
            }
        ]
    },
    output: {
        path: PATHS.dist,
        filename: "main.js",
        publicPath: "/"
    }
};
