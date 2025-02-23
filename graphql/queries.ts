import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts($first: Int!) {
    posts(first: $first, where: { status: PUBLISH }) {
      nodes {
        databaseId
        title
        link
        date
        excerpt(format: RENDERED)
        commentCount
        featuredImage {
          node {
            sourceUrl
            mediaDetails {
              width
              height
              sizes {
                sourceUrl
                height
                width
                name
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  query GetPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      databaseId
      title
      link
      content(format: RENDERED)
      excerpt(format: RENDERED)
      date
      commentCount
      featuredImage {
        node {
          sourceUrl
          mediaDetails {
            width
            height
            sizes {
              sourceUrl
              height
              width
              name
            }
          }
        }
      }
      author {
        node {
          name
          avatar {
            url
          }
        }
      }
      categories {
        nodes {
          databaseId
          name
        }
      }
      tags {
        nodes {
          databaseId
          name
        }
      }
      comments(first: 30, where: { statusIn: APPROVE, order: ASC }) {
        nodes {
          date
          databaseId
          status
          content(format: RENDERED)
          author {
            node {
              name
              url
              email
              avatar {
                url
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PAGE_BY_SLUG = gql`
  query GetPage($slug: ID = "URI") {
    page(id: $slug, idType: URI) {
      databaseId
      date
      title(format: RENDERED)
      content(format: RENDERED)
      featuredImage {
        node {
          sourceUrl
          mediaDetails {
            width
            height
            sizes {
              sourceUrl
              height
              width
              name
            }
          }
        }
      }
      author {
        node {
          name
          avatar {
            url
          }
        }
      }
    }
  }
`;

export const GET_POST_PREVIEW = gql`
  query GetPostPreview($id: ID!) {
    post(id: $id, idType: DATABASE_ID, asPreview: true) {
      databaseId
      title
      content(format: RENDERED)
      excerpt(format: RENDERED)
      date
      featuredImage {
        node {
          sourceUrl
          mediaDetails {
            width
            height
            sizes {
              sourceUrl
              height
              width
              name
            }
          }
        }
      }
      author {
        node {
          name
          avatar {
            url
          }
        }
      }
      categories {
        nodes {
          databaseId
          name
        }
      }
      tags {
        nodes {
          databaseId
          name
        }
      }
    }
  }
`;
