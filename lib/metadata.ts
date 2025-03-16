import type { Metadata } from 'next';
import type { Robots } from 'next/dist/lib/metadata/types/metadata-types';
import type { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';
import type { Twitter } from 'next/dist/lib/metadata/types/twitter-types';

import type { GetPageQuery, GetPostQuery } from '@/graphql/generated/graphql';

type SEOMetadata =
  | NonNullable<GetPostQuery['post']>['seo']
  | NonNullable<GetPageQuery['page']>['seo']
  | undefined;

type TwitterCardType = 'summary' | 'summary_large_image' | 'player' | 'app';

const mapTwitterCardType = (card?: string | null): TwitterCardType => {
  switch (card?.toUpperCase()) {
    case 'SUMMARY':
    case 'SUMMARY_LARGE_IMAGE':
    case 'PLAYER':
    case 'APP':
      return card?.toLowerCase() as TwitterCardType;
    default:
      return 'summary'; // Default value ถ้าไม่มีหรือไม่ตรง
  }
};

const generateRobots = (
  robots?: (string | null)[] | null
): null | string | Robots | undefined => {
  if (!robots) return undefined;

  const config: Record<string, any> = {};

  robots.forEach(rule => {
    if (!rule) return;

    if (rule === 'index') config.index = true;
    if (rule === 'follow') config.follow = true;
    if (rule.includes('max-snippet')) {
      config['max-snippet'] = parseInt(rule.split(':')[1]);
    }
    if (rule.includes('max-video-preview')) {
      config['max-video-preview'] = parseInt(rule.split(':')[1]);
    }
    if (rule.includes('max-image-preview')) {
      config['max-image-preview'] = rule.split(':')[1];
    }
  });

  return config;
};

type OpenGraphType =
  | 'website'
  | 'article'
  | 'book'
  | 'profile'
  | 'music.song'
  | 'music.album'
  | 'music.playlist'
  | 'music.radio_station'
  | 'video.movie'
  | 'video.episode'
  | 'video.tv_show'
  | 'video.other';

const generateOpenGraphMetadata = (
  openGraph?: NonNullable<SEOMetadata>['openGraph']
): OpenGraph | undefined => {
  if (!openGraph) return undefined;

  return {
    title: openGraph.title ?? undefined,
    description: openGraph.description ?? undefined,
    siteName: openGraph.siteName ?? undefined,
    type: (openGraph.type as OpenGraphType) ?? undefined,
    url: openGraph.url ?? undefined,
    images: openGraph.image?.url
      ? [
          {
            url: openGraph.image.url,
            secureUrl: openGraph.image.secureUrl ?? undefined,
            width: openGraph.image.width ?? undefined,
            height: openGraph.image.height ?? undefined,
            type: openGraph.image.type ?? undefined,
          },
        ]
      : undefined,
  };
};

const generateTwitterMetadata = (
  openGraph?: NonNullable<SEOMetadata>['openGraph']
): Twitter | undefined => {
  if (!openGraph?.twitterMeta) return undefined;

  return {
    title: openGraph.twitterMeta.title ?? undefined,
    description: openGraph.twitterMeta.description ?? undefined,
    card: mapTwitterCardType(openGraph.twitterMeta.card),
    images: openGraph.twitterMeta.image
      ? [openGraph.twitterMeta.image]
      : undefined,
  };
};

export function generateSeoMetadata(metadata?: SEOMetadata): Metadata {
  if (!metadata) return {};

  return {
    title: metadata.title ?? undefined,
    description: metadata.description ?? undefined,
    keywords: metadata.focusKeywords?.join(',') ?? undefined,
    robots: generateRobots(metadata.robots),
    alternates: {
      canonical: metadata.canonicalUrl ?? undefined,
    },
    openGraph: generateOpenGraphMetadata(metadata.openGraph),
    twitter: generateTwitterMetadata(metadata.openGraph),
  };
}
