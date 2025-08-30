require('dotenv').config({ path: '.env.cma' });

const contentfulManagement = require('contentful-management');

/**
 * @returns {Promise<import('contentful-management').Environment>}
 */
module.exports = async function getContentfulEnvironment() {
  const client = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_CMA_TOKEN,
  });

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
  const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');

  return environment;
};
