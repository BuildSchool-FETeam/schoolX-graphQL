import {
  DELETE_COURSE,
  GET_COURSES,
  GET_COURSE_BY_ID,
  SET_COURSE,
} from 'e2e/src/gql/course.gql'
import {
  CourseSetInput,
  GqlCourseResponse,
} from 'e2e/src/interfaces/courses.interface'
import { gqlRequest } from 'e2e/src/utils/api-call'

export function getCourseInput(
  courseInput?: Partial<CourseSetInput>
): CourseSetInput {
  return {
    title: 'Course 1',
    description: 'Description',
    benefits: ['Benefit'],
    requirements: ['require'],
    tags: ['Beginer'],
    levels: ['Beginer'],
    ...courseInput,
  }
}

export async function getCourses(token: string) {
  const response = await gqlRequest<GqlCourseResponse>(GET_COURSES, {}, token)

  return response.courseQuery.courses
}

export async function getCourseById(id: string, token: string) {
  const response = await gqlRequest<GqlCourseResponse>(
    GET_COURSE_BY_ID,
    { id },
    token
  )

  return response.courseQuery.course
}

export async function setCourse(
  input: CourseSetInput,
  token: string,
  id?: string
) {
  const response = await gqlRequest<
    GqlCourseResponse,
    { data: CourseSetInput; id?: string }
  >(SET_COURSE, { data: input, id }, token)

  return response.courseMutation.setCourse
}

export async function deleteCourse(id: string, token: string) {
  const response = await gqlRequest<GqlCourseResponse, { id: string }>(
    DELETE_COURSE,
    { id },
    token
  )

  return response.courseMutation.deleteCourse
}
