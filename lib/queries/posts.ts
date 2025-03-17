import {
  GetPostDocument,
  GetPostsByAuthorDocument,
  GetPostsByCategoryDocument,
  GetPostsBySearchDocument,
  GetPostsByTagDocument,
  GetPostsDocument,
  PostIdType,
} from '@/graphql/generated/graphql';
import client from '../apolloClient';
import config from '../config';
import { getRevalidateOptions } from '../revalidation';
import type { GetPostsBySearchProps, GraphQLQueryProps } from '../types';
import { getAuthToken } from './auth';

// ฟังก์ชั่นสำหรับดึงข้อมูลบทความ
export async function getPosts(props?: Omit<GraphQLQueryProps, 'slug'>) {
  try {
    const { data } = await client.query({
      query: GetPostsDocument,
      variables: { first: props?.limit || config.limitPosts },
      fetchPolicy: props?.fetchPolicy,
      context: getRevalidateOptions(props?.next, 'posts'),
    });

    return data?.posts?.nodes || null;
  } catch (error) {
    console.error(
      `[getPosts] Error fetching posts: ${error instanceof Error ? error.message : error}`
    );
    return null;
  }
}

export async function getPostsBySearch(props: GetPostsBySearchProps) {
  if (!props.search) return null;

  try {
    const { data } = await client.query({
      query: GetPostsBySearchDocument,
      variables: {
        first: props?.limit || config.limitPosts,
        search: props.search,
      },
      fetchPolicy: props?.fetchPolicy,
      context: getRevalidateOptions(
        props?.next,
        `posts-search:${props.search}`
      ),
    });

    return data?.posts?.nodes || null;
  } catch (error) {
    console.error(
      `[getPostsBySearch] Error fetching posts: ${error instanceof Error ? error.message : error}`
    );
    return null;
  }
}

// ฟังก์ชั่นสำหรับดึงข้อมูลบทความตามหมวดหมู่
export async function getPostsByCategory(props: GraphQLQueryProps) {
  if (!props.slug) return null;

  try {
    const { data } = await client.query({
      variables: { first: props?.limit || config.limitPosts, slug: props.slug },
      query: GetPostsByCategoryDocument,
      fetchPolicy: props?.fetchPolicy,
      context: getRevalidateOptions(
        props?.next,
        `posts-category:${props.slug}`
      ),
    });

    return data?.category || null;
  } catch (error) {
    console.error(
      `[getPostsByCategory] Error fetching posts: ${error instanceof Error ? error.message : error}`
    );
    return null;
  }
}

// ฟังก์ชั่นสำหรับดึงข้อมูลบทความตามแท็ก
export async function getPostsByTag(props: GraphQLQueryProps) {
  if (!props.slug) return null;

  try {
    const { data } = await client.query({
      query: GetPostsByTagDocument,
      variables: { first: props?.limit || config.limitPosts, slug: props.slug },
      fetchPolicy: props?.fetchPolicy,
      context: getRevalidateOptions(props?.next, `posts-tag:${props.slug}`),
    });

    return data?.tag || null;
  } catch (error) {
    console.error(
      `[getPostsByTag] Error fetching posts: ${error instanceof Error ? error.message : error}`
    );
    return null;
  }
}

// ฟังก์ชั่นสำหรับดึงข้อมูลบทความตามผู้เขียน
export async function getPostsByAuthor(props: GraphQLQueryProps) {
  if (!props.slug) return null;

  try {
    const { data } = await client.query({
      query: GetPostsByAuthorDocument,
      variables: { first: props?.limit || config.limitPosts, slug: props.slug },
      fetchPolicy: props?.fetchPolicy,
      context: getRevalidateOptions(props?.next, `posts-author:${props.slug}`),
    });

    return data?.user || null;
  } catch (error) {
    console.error(
      `[getPostsByAuthor] Error fetching posts: ${error instanceof Error ? error.message : error}`
    );
    return null;
  }
}

// ฟังก์ชั่นสำหรับดึงข้อมูลบทความตาม slug
export async function getPost(props: Omit<GraphQLQueryProps, 'limit'>) {
  if (!props.slug) return null;

  try {
    const { data } = await client.query({
      query: GetPostDocument,
      variables: {
        slug: props.slug,
        idType: PostIdType.Slug,
      },
      fetchPolicy: props?.fetchPolicy,
      context: getRevalidateOptions(props?.next, `post:${props.slug}`),
    });

    return data?.post || null;
  } catch (error) {
    console.error(
      `[getPost] Error fetching post: ${error instanceof Error ? error.message : error}`
    );
    return null;
  }
}

// ฟังก์ชั่นสำหรับดึงข้อมูลบทความตาม slug
export async function getPostPreview(props: Omit<GraphQLQueryProps, 'limit'>) {
  if (!props.slug) return null;

  try {
    const authToken = await getAuthToken();
    if (!authToken) {
      console.error('[getPostPreview] No valid auth token available');
      return null;
    }

    const { data } = await client.query({
      query: GetPostDocument,
      variables: {
        slug: props.slug,
        idType: PostIdType.DatabaseId,
        isPreview: true,
      },
      fetchPolicy: 'network-only',
      context: {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    });

    return data?.post || null;
  } catch (error) {
    console.error(
      `[getPostPreview] Error fetching post: ${error instanceof Error ? error.message : error}`
    );
    return null;
  }
}
