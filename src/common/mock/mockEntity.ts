import { assign } from 'lodash'
import { AdminUser } from 'src/adminUser/AdminUser.entity'
import { Article, ArticleStatus } from 'src/article/entities/Article.entity'
import { ArticleTag } from 'src/article/entities/ArticleTag.entity'
import { EvaluationComment } from 'src/assignment/entities/fileAssignment/evaluationComment.entity'
import { SubmittedAssignment } from 'src/assignment/entities/fileAssignment/SubmittedAssignment.entity'
import { Achievement } from 'src/clientUser/entities/Achivement.entity'
import { ClientUser } from 'src/clientUser/entities/ClientUser.entity'
import { Instructor } from 'src/instructor/entities/Instructor.entity'
import { Role } from 'src/permission/entities/Role.entity'

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
    dayOfBirth: new Date().toISOString(),
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