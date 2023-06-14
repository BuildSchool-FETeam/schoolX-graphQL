export interface CourseSetInput {
  title: string
  description: string
  benefits: string[]
  requirements: string[]
  image?: unknown
  tags: string[]
  levels: string[]
}

export interface CourseType {
  id: string
  title: string
}

export interface GqlCourseResponse {
  courseMutation: {
    setCourse?: CourseType
    deleteCourse?: boolean
  }
  courseQuery: {
    courses?: CourseType[]
    course?: CourseType
  }
}
