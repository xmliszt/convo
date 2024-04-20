import { MetadataRoute } from 'next';

import { fetchScenarios } from './scenarios/services/fetch-scenarios';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { scenarios } = await fetchScenarios();
  return [
    {
      url: 'https://convo.website',
      lastModified: new Date(),
    },
    {
      url: 'https://convo.website/scenarios',
      lastModified: new Date(),
    },
    ...scenarios.map((scenario) => ({
      url: `https://convo.website/scenarios/${scenario.id}`,
      lastModified: new Date(),
    })),
  ];
}
