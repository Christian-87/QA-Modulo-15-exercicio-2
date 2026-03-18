const { defineConfig } = require('cypress')
const { allureCypress } = require ("allure-cypress/reporter");

module.exports = defineConfig({
  e2e: {  
    baseUrl: 'https://serverest.dev',
    setupNodeEvents(on, config) {
      allureCypress(on, config, {
        resultsDir: "allure-results",
      });
      return config;
      
      

    },
  },
});