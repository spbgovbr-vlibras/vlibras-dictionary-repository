module.exports = {
  extends: "airbnb-base",
  rules: {
    "no-console": [
      "error",
      {
        allow: [
          "error"
        ],
      },
    ],
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
      },
    ],
    "no-restricted-syntax": [
      "error",
      "ForInStatement",
    ],
  },
};
