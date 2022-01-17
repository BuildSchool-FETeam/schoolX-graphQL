import { assign } from 'lodash'
import { AdminUser } from 'src/adminUser/AdminUser.entity'
import { Article, ArticleStatus } from 'src/article/entities/Article.entity'
import { ArticleTag } from 'src/article/entities/ArticleTag.entity'
import { Assignment } from 'src/assignment/entities/Assignment.entity'
import { EvaluationComment } from 'src/assignment/entities/fileAssignment/evaluationComment.entity'
import { FileAssignment } from 'src/assignment/entities/fileAssignment/fileAssignment.entity'
import { GroupAssignment } from 'src/assignment/entities/fileAssignment/groupAssignment.entity'
import { SubmittedAssignment } from 'src/assignment/entities/fileAssignment/SubmittedAssignment.entity'
import { Achievement } from 'src/clientUser/entities/Achivement.entity'
import { ClientUser } from 'src/clientUser/entities/ClientUser.entity'
import { UserComment } from 'src/comment/entities/UserComment.entity'
import { Quiz } from 'src/assignment/entities/quiz/Quiz.entity'
import { Course } from 'src/courses/entities/Course.entity'
import { Lesson } from 'src/courses/entities/Lesson.entity'
import { Instructor } from 'src/instructor/entities/Instructor.entity'
import { Role } from 'src/permission/entities/Role.entity'
import { CodeChallenge } from 'src/assignment/entities/codeChallenge/CodeChallenge.entity'

export const createSubmittedEntityMock = (
  data?: Partial<SubmittedAssignment>
) => {
  const defaultData = {
    id: '1',
    title: 'file Assignment 1',
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString(),
    description: '',
    order: 1,
    fileUrl: '',
    reApply: false,
    comments: [],
    group: new GroupAssignment(),
    hasSeen: false,
  }

  return assign(new SubmittedAssignment(), { ...defaultData, ...data })
}

export const createGroupAssignmentEntityMock = (
  data?: Partial<GroupAssignment>
) => {
  const defaultData = {
    id: '1',
    title: 'group 1',
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString(),
    user: new ClientUser(),
    previousScore: null,
    submitteds: [],
    fileAssignment: new FileAssignment(),
    isUpdated: false,
  }

  return assign(new GroupAssignment(), { ...defaultData, ...data })
}

export const createCourseEntityMock = (data?: Partial<Course>) => {
  const defaultData = {
    id: '1',
    title: 'Course 1',
    updatedAt: new Date().toLocaleDateString(),
    createdAt: new Date().toLocaleDateString(),
    description: 'here course 1',
    votes: 0,
    imageUrl: 'url image',
    filePath: 'path',
    timeByHour: 20,
    lesson: [],
    instructor: new Instructor(),
    isCompleted: false,
    benefits: [],
    requirements: 'no',
    joinedUsers: [],
    completedUser: [],
    tags: [],
    levels: 'Beginner',
    comments: [],
    createBy: new AdminUser(),
  }

  return assign(new Course(), { ...defaultData, ...data })
}

export const createFileAssignmentEntityMock = (
  data?: Partial<FileAssignment>
) => {
  const defaultData = {
    id: '2f8bdfa5-454a-2304-cs5d-3456ac3dd78d4',
    title: 'File Assignment 1',
    updatedAt: new Date().toLocaleDateString(),
    createdAt: new Date().toLocaleDateString(),
    description: 'here file assignment 1',
    maxScore: 100,
    estimateTimeInMinute: 30,
    contentInstruct: 'no',
    videoInstruct: 'no',
    explainContent: 'no',
    explainVideo: 'no',
    assignment: new Assignment(),
    SubmittedGroupAssignments: [],
  }

  return assign(new FileAssignment(), { ...defaultData, ...data })
}

export const createQuizEntityMock = (data?: Partial<Quiz>) => {
  const defaultData = {
    id: '2f8bdfa5-454a-4713-da3b-2937a3bb76d4',
    title: 'Quiz 1',
    updatedAt: new Date().toLocaleDateString(),
    createdAt: new Date().toLocaleDateString(),
    description: 'here quiz 1',
    score: 100,
    assignment: new Assignment(),
    questions: [],
    timeByMinute: 30,
  }

  return assign(new Quiz(), { ...defaultData, ...data })
}

export const createCodeChallengeEntityMock = (
  data?: Partial<CodeChallenge>
) => {
  const defaultData = {
    id: '2f8bdfa5-464a-4713-be3b-2937a3bb78d3',
    title: 'Code Challenge 1',
    updatedAt: new Date().toLocaleDateString(),
    createdAt: new Date().toLocaleDateString(),
    description: 'code challenge 1',
    hints: [],
    score: 100,
    assignment: new Assignment(),
    input: '10',
    output: '100',
    languageSupport: 'Javascript',
    testCases: [],
  }

  return assign(new CodeChallenge(), { ...defaultData, ...data })
}

export const createLessonEntityMock = (data?: Partial<Lesson>) => {
  const defaultData = {
    id: '1',
    title: 'Lesson 1',
    updatedAt: new Date().toLocaleDateString(),
    createdAt: new Date().toLocaleDateString(),
    videoUrl: 'url',
    votes: '100',
    course: new Course(),
    content: 'content',
    comments: [],
    assignment: new Assignment(),
    documents: [],
  }

  return assign(new Lesson(), { ...defaultData, ...data })
}

export const createAssignmentEntityMock = (data?: Partial<Assignment>) => {
  const defaultData = {
    id: '1',
    updatedAt: new Date().toLocaleDateString(),
    createdAt: new Date().toLocaleDateString(),
    title: 'Assignment',
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

export const createClientUserEntityMock = (data?: Partial<ClientUser>) => {
  const defaultData: ClientUser = {
    email: 'test@test.com',
    password: '123456',
    githubUrl: '',
    dayOfBirth: new Date('1-6-1990').toISOString(),
    homeTown: 'Dalat',
    bio: 'none',
    phone: '0123 123 432',
    imageUrl: '',
    filePath: '',
    isActive: 1,
    activationCode: '',
    activationCodeExpire: 0,
    comments: [],
    instructor: new Instructor(),
    achievement: new Achievement(),
    role: new Role(),
    articles: [],
    submittedGroupAssignments: [],
    id: '',
    name: '',
    createdAt: new Date('1-6-2022'),
    updatedAt: new Date('1-6-2022'),
  }

  return assign(new ClientUser(), { ...defaultData, ...data })
}

export const createArticleTag = (data?: Partial<ArticleTag>) => {
  const defaultData: ArticleTag = {
    articles: [],
    id: '1',
    title: 'title_1',
    createdAt: new Date('1-6-2022'),
    updatedAt: new Date('1-6-2022'),
  }

  return assign(new ArticleTag(), { ...defaultData, ...data })
}

export const createArticleEntityMock = (data?: Partial<Article>) => {
  const defaultData: Article = {
    shortDescription: 'a desc',
    content: 'content',
    votes: 0,
    status: ArticleStatus.pending,
    createdBy: new ClientUser(),
    comments: [],
    views: 0,
    shares: 0,
    reviewComment: '',
    tags: [],
    id: '',
    title: '',
    createdAt: new Date('1-6-2022'),
    updatedAt: new Date('1-6-2022'),
  }

  return assign(new Article(), { ...defaultData, ...data })
}

export const createCommentEntityMock = (data?: Partial<UserComment>) => {
  const defaultData: UserComment = {
    createdBy: new ClientUser(),
    content: '',
    votes: 0,
    reply: [],
    course: new Course(),
    lesson: new Lesson(),
    assignment: new Assignment(),
    article: new Article(),
    replyTo: new UserComment(),
    submittedAssignment: new SubmittedAssignment(),
    id: '1',
    title: 'a comment',
    createdAt: new Date('1-6-2022'),
    updatedAt: new Date('1-6-2022'),
  }

  return assign(new UserComment(), { ...defaultData, ...data })
}
