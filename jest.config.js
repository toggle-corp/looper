module.exports = {
    "roots": [
        "<rootDir>/src"
    ],
    /*
    "setupFiles": [
        "./setupTests.js"
    ],
    */
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
}
