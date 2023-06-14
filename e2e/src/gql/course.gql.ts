import { gql } from 'graphql-request'

export const SET_COURSE = gql`
  mutation SetCourse($data: CourseSetInput!, $id: ID) {
    courseMutation {
      setCourse(data: $data, id: $id) {
        id
        title
      }
    }
  }
`

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    courseMutation {
      deleteCourse(id: $id)
    }
  }
`

export const GET_COURSES = gql`
  query {
    courseQuery {
      courses {
        id
        title
        createdBy {
          email
        }
      }
    }
  }
`

export const GET_COURSE_BY_ID = gql`
  query GetCourse($id: ID!) {
    courseQuery {
      course(id: $id) {
        id
        title
        createdBy {
          email
        }
      }
    }
  }
`
