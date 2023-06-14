import { INSTRUCTOR_SIGNIN, INSTRUCTOR_SIGNUP } from 'e2e/src/gql/client.gql'
import {
  ClientUserSignupInput,
  GqlClientResponse,
  SignupEnumType,
} from 'e2e/src/interfaces/client.interfaces'
import { gqlRequest } from 'e2e/src/utils/api-call'
import { ClientUserSigninInput } from 'src/graphql'
import {
  deleteCourse,
  getCourseById,
  getCourseInput,
  getCourses,
  setCourse,
} from '../common/course.utils'
import * as _ from 'lodash'
import { PASSWORD } from '../common/constant'
import { getErrMessage } from '../common/common.utils'

describe('Client Smoke test. #smoke', () => {
  let userAToken = ''
  let userBToken = ''
  let studentAToken = ''
  const now = Date.now()

  async function signupClient(input?: Partial<ClientUserSignupInput>) {
    const data = await gqlRequest<
      GqlClientResponse,
      { data: ClientUserSignupInput }
    >(INSTRUCTOR_SIGNUP, {
      data: {
        email: 'test01@test.com',
        name: 'userA',
        password: PASSWORD,
        type: SignupEnumType.INSTRUCTOR,
        ...input,
      },
    })

    return data.clientUserAuthMutation.signUp
  }

  async function signinClient(input: ClientUserSigninInput) {
    const data = await gqlRequest<
      GqlClientResponse,
      { data: ClientUserSigninInput }
    >(INSTRUCTOR_SIGNIN, {
      data: {
        ...input,
      },
    })

    return data.clientUserAuthMutation.signIn
  }

  beforeAll(async () => {
    const response = await signupClient({
      email: `userA_${now}@test.com`,
      name: `userA_${now}`,
    })
    userAToken = response.token

    const responseB = await signupClient({
      email: `userB_${now}@test.com`,
      name: `userB_${now}`,
    })
    userBToken = responseB.token

    const responseStudentA = await signupClient({
      email: `studentA_${now}@test.com`,
      name: `studentA_${now}`,
      type: SignupEnumType.LEARNER,
    })
    studentAToken = responseStudentA.token
  })

  it('should signin 3 users successfully', async () => {
    const response_1 = await signinClient({
      email: `userA_${now}@test.com`,
      password: PASSWORD,
    })
    const response_2 = await signinClient({
      email: `userB_${now}@test.com`,
      password: PASSWORD,
    })
    const response_3 = await signinClient({
      email: `studentA_${now}@test.com`,
      password: PASSWORD,
    })

    expect(response_1.token).toBeDefined()
    expect(response_2.token).toBeDefined()
    expect(response_3.token).toBeDefined()
  })

  describe('course reading ability and permission', () => {
    const courseIdsA: string[] = []
    const courseIdsB: string[] = []

    beforeAll(async () => {
      const response_1 = await setCourse(
        getCourseInput({ title: 'Course #1 by user A' }),
        userAToken
      )
      const response_2 = await setCourse(
        getCourseInput({ title: 'Course #2 by user A' }),
        userAToken
      )

      const response_3 = await setCourse(
        getCourseInput({ title: 'Course by user B' }),
        userBToken
      )

      courseIdsA.push(response_1.id, response_2.id)
      courseIdsB.push(response_3.id)
    })

    it('User A should see all course from userB and vice versa. #p1', async () => {
      let courses = await getCourses(userAToken)

      expect(courses.length).toBe(3)
      courses.forEach((c) => {
        expect(courseIdsA.includes(c.id) || courseIdsB.includes(c.id)).toBe(
          true
        )
      })

      // User B try to read all courses
      courses = await getCourses(userBToken)
      expect(courses.length).toBe(3)
      courses.forEach((c) => {
        expect(courseIdsA.includes(c.id) || courseIdsB.includes(c.id)).toBe(
          true
        )
      })
    })

    it("User A can update his own course but not with userB's course. #p2", async () => {
      const updatedCourseId = courseIdsA[0]

      await setCourse(
        getCourseInput({ title: 'Course A Updated to v2' }),
        userAToken,
        updatedCourseId
      )
      const response = await getCourseById(updatedCourseId, userAToken)
      expect(response.title).toBe('Course A Updated to v2')

      // userA try to UPDATE course from userB
      try {
        await setCourse(
          getCourseInput({ title: 'Course A2 Updated to v2' }),
          userAToken,
          courseIdsB[0]
        )
      } catch (err) {
        expect(getErrMessage(err)).toBe(
          "You don't have permission to do this action on resource"
        )
      }
    })

    it('StudentA can see all courses but cannot perform any other actions on it', async () => {
      // Try to create course
      try {
        await setCourse(
          getCourseInput({ title: 'Student course' }),
          studentAToken
        )
      } catch (err) {
        expect(getErrMessage(err)).toBe('Forbidden resource')
      }
      // try to read course
      const courses = await getCourses(studentAToken)
      expect(courses.length).toBe(3)
    })

    it("User A can delete his own course but not with userB's course. #p1", async () => {
      const deletedCourseId = courseIdsA[0]
      _.remove(courseIdsA, (cId) => cId === deletedCourseId)

      const res1 = await deleteCourse(deletedCourseId, userAToken)
      expect(res1).toBe(true)

      // userA try to delete course from userB
      try {
        await deleteCourse(courseIdsB[0], userAToken)
      } catch (err) {
        expect(err.response.errors[0].message).toBe(
          "You don't have permission to do this action on resource"
        )
      }
    })

    afterAll(() => {
      console.log('Course teardown')
      courseIdsA.forEach(async (id) => deleteCourse(id, userAToken))
      courseIdsB.forEach(async (id) => deleteCourse(id, userBToken))
    })
  })
})
