import {
  DELETE_ARTICLE,
  GET_ARTICLES,
  SET_ARTICLE,
} from 'e2e/src/gql/article.gql'
import {
  ArticleInputType,
  GqlArticleResponse,
} from 'e2e/src/interfaces/article.interface'
import { gqlRequest } from 'e2e/src/utils/api-call'

export async function setArticle(
  data: ArticleInputType,
  token: string,
  id?: string
) {
  const res = await gqlRequest<
    GqlArticleResponse,
    { data: ArticleInputType; id: string }
  >(SET_ARTICLE, { data, id }, token)

  return res.articleMutation.setArticle
}

export async function deleteArticle(token: string, id: string) {
  const res = await gqlRequest<GqlArticleResponse, { id: string }>(
    DELETE_ARTICLE,
    { id },
    token
  )

  return res.articleMutation.deleteArticle
}

export async function getArticles(token: string) {
  const res = await gqlRequest<GqlArticleResponse>(GET_ARTICLES, token)

  return res.articleQuery.articles
}

export function getArticleInput(
  artInput?: Partial<ArticleInputType>
): ArticleInputType {
  return {
    title: 'Article 1',
    shortDescription: 'An awesome article',
    content: 'Most awesome must read',
    tags: ['tags 1'],
    ...artInput,
  }
}
