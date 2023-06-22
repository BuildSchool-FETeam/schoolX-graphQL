import { gql } from 'graphql-request'

export const SET_ARTICLE = gql`
  mutation SetArticle($data: ArticleInputType!, $id: ID) {
    articleMutation {
      setArticle(data: $data, id: $id) {
        id
        title
        createdBy {
          id
        }
      }
    }
  }
`

export const DELETE_ARTICLE = gql`
  mutation DeleteArticle($id: ID!) {
    articleMutation {
      deleteArticle(id: $id)
    }
  }
`

export const GET_ARTICLES = gql`
  query {
    articleQuery {
      articles {
        id
        title
      }
    }
  }
`
