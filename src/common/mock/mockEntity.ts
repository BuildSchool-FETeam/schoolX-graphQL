import { assign } from 'lodash'
import { AdminUser } from 'src/adminUser/AdminUser.entity'
import { Assignment } from 'src/assignment/entities/Assignment.entity'
import { CodeChallenge } from 'src/assignment/entities/codeChallenge/CodeChallenge.entity'
import { EvaluationComment } from 'src/assignment/entities/fileAssignment/evaluationComment.entity'
import { SubmittedAssignment } from 'src/assignment/entities/fileAssignment/SubmittedAssignment.entity'
import { Quiz } from 'src/assignment/entities/quiz/Quiz.entity'
import { Course } from 'src/courses/entities/Course.entity'
import { Lesson } from 'src/courses/entities/Lesson.entity'
import { Role } from 'src/permission/entities/Role.entity'

export const createQuizEntityMock = (data?: Partial<Quiz>) => {
  const defaultData = {
    id: "2f8bdfa5-454a-4713-da3b-2937a3bb76d4",
    title: "Quiz 1",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "here quiz 1",
    score: 100,
    assignment: new Assignment(),
    questions: [],
    timeByMinute: 30,
  }

  return assign(new Quiz(), {...defaultData, ...data});
}

export const createCodeChallengeEntityMock = (data?: Partial<CodeChallenge>) => {
  const defaultData = {
    id: "2f8bdfa5-464a-4713-be3b-2937a3bb78d3",
    title: "Code Challenge 1",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "code challenge 1",
    hints: [],
    score: 100,
    assignment: new Assignment(),
    input: "10",
    output: "100",
    languageSupport: "Javascript",
    testCases: [] 
  }

  return assign(new CodeChallenge(), {...defaultData, ...data});
}

export const createLessonEntityMock = (data?: Partial<Lesson>) => {
  const defaultData = {
    id: "1",
    title: "Lesson 1",
    createdAt: new Date(),
    updatedAt: new Date(), 
    videoUrl: "url",
    votes: "100",
    course: new Course(),
    content: "content",
    comments: [],
    assignment: new Assignment(),
    documents: []
  }

  return assign(new Lesson(), {...defaultData, ...data});
}

export const createAssignmentEntityMock = (data?: Partial<Assignment>) => {
  const defaultData = {
    id: '1',
    updatedAt: new Date(),
    createdAt: new Date(),
    title: "Assignment",
    lesson: new Lesson(),
    comments: [],
    quizs: [],
    codeChallenges: [],
    fileAssignments: [],
    userComplete: [],
  }

  return assign(new Assignment(), { ...defaultData, ...data })
}

export const createAdminUserEntityMock = (data?: Partial<AdminUser>) => {
  const defaultData = {
    id: '1',
    name: 'leesin',
    email: 'test@test.com',
    password: 'Leesin123',
    role: new Role(),
    evaluationComments: [],
    createdBy: new AdminUser(),
  }

  return assign(new AdminUser(), { ...defaultData, ...data })
}

export const createRoleEntityMock = (role: Partial<Role>) => {
  return assign(new Role(), { ...role })
}

export const createEvaluationCommentEntityMock = (
  data?: Partial<EvaluationComment>
) => {
  const defaultData: EvaluationComment = {
    id: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    content: 'content',
    createdBy: new AdminUser(),
    submitted: new SubmittedAssignment(),
  }

  return assign(new EvaluationComment(), { ...defaultData, ...data })
}
