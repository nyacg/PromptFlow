module.exports = {
  preset: 'ts-jest',
  setupFiles:['dotenv/config'],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest",
  }
};