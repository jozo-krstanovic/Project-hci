import { createClient } from "contentful";

const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

if (!spaceId || !accessToken) {
  throw new Error("Missing Contentful Space ID or Access Token environment variables");
}

export const contentfulClient = createClient({
  space: spaceId,
  accessToken: accessToken,
});
