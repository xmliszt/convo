import { MetadataRoute } from 'next';

import { fetchScenarios } from './scenarios/services/fetch-scenarios';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { scenarios } = await fetchScenarios();
  const categories = scenarios.reduce<string[]>((acc, scenario) => {
    scenario.categories.forEach((category) => {
      if (!acc.includes(category)) acc.push(category);
    });
    return acc;
  }, []);

  return [
    {
      url: 'https://convo.website',
      lastModified: new Date(),
    },
    {
      url: 'https://convo.website/scenarios',
      lastModified: new Date(),
    },
    {
      url: 'https://convo.website/profile',
      lastModified: new Date(),
    },
    ...categories.map((category) => ({
      url: `https://convo.website/scenarios?category=${encodeURIComponent(category)}`,
      lastModified: new Date(),
    })),
  ];
}
