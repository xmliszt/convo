import { NextRequest } from 'next/server';

import { fetchScenarios } from '@/app/scenarios/services/fetch-scenarios';

const generateTxtSitemap = async (): Promise<string> => {
  let sitemap = '';
  const { scenarios } = await fetchScenarios();
  const categories = scenarios.reduce<string[]>((acc, scenario) => {
    scenario.categories.forEach((category) => {
      if (!acc.includes(category)) {
        acc.push(category);
      }
    });
    return acc;
  }, []);
  scenarios.forEach(
    (scenario) =>
      (sitemap += `https://convo.website/scenarios/${scenario.id}\n`)
  );
  categories.forEach(
    (category) =>
      // URL encoded category
      (sitemap += `https://convo.website/scenarios?category=${encodeURIComponent(category)}\n`)
  );
  return sitemap;
};

export async function GET(request: NextRequest) {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  const { searchParams } = new URL(request.url);
  const fileType = searchParams.get('type') ?? 'txt';
  switch (fileType) {
    case 'txt':
      try {
        const content = await generateTxtSitemap();
        return new Response(content, {
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
      }
    default:
      break;
  }
  return new Response('sitemap file type not recognised', { status: 400 });
}
