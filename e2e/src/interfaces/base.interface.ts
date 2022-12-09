export interface IBase {
  id?: string
  __typename?: string
}

export interface PaginationInput {
  skip?: number
  limit?: number
  order?: {
    orderBy: string
    direction: 'ASC' | 'DESC'
  }
}

export interface SearchOptionInput {
  searchString: string
  searchFields: string[]
}
