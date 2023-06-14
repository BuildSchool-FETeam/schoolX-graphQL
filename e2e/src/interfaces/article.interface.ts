export interface ArticleInputType {
  title: string
  shortDescription: string
  content: string
  tags: string[]
}

export interface ArticleType {
  id: string
  title: string
}

export interface GqlArticleResponse {
  articleMutation?: {
    deleteArticle?: boolean
    setArticle?: ArticleType
  }
  articleQuery?: {
    articles?: ArticleType[]
  }
}
