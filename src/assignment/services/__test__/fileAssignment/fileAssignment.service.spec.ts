import { BadRequestException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { FileAssignment } from 'src/assignment/entities/fileAssignment/fileAssignment.entity'
import { ClientUser } from 'src/clientUser/entities/ClientUser.entity'
import { ClientUserService } from 'src/clientUser/services/clientUser.service'
import { baseServiceMock } from 'src/common/mock/baseServiceMock'
import { assertThrowError } from 'src/common/mock/customAssertion'
import {
  createAssignmentEntityMock,
  createClientUserEntityMock,
  createFileAssignmentEntityMock,
  createGroupAssignmentEntityMock,
  createLessonEntityMock,
  createSubmittedEntityMock,
} from 'src/common/mock/mockEntity'
import {
  QueryBuilderMock,
  repositoryMockFactory,
} from 'src/common/mock/repositoryMock'
import { Lesson } from 'src/courses/entities/Lesson.entity'
import { LessonService } from 'src/courses/services/lesson.service'
import {
  EvaluationInput,
  FileAssignmentSetInput,
  SearchOptionInput,
  SubmitInput,
} from 'src/graphql'
import { Repository } from 'typeorm'
import { AssignmentService } from '../../assignment.service'
import { FileAssignmentService } from '../../fileAssignment/fileAssignment.service'
import { GroupAssignmentService } from '../../fileAssignment/groupAssignment.service'

const lessonServiceMock = {
  ...baseServiceMock,
}
const assignmentServiceMock = {
  async createAssignment() {
    return Promise.resolve({})
  },
  ...baseServiceMock,
  deleteAssign() {
    return {}
  },
}
const groupAssignmentServiceMock = {
  async create() {
    return Promise.resolve({})
  },

  async update() {
    return Promise.resolve({})
  },

  async evaluation() {
    return Promise.resolve({})
  },

  async viewSubmitted() {
    return Promise.resolve({})
  },
}
const clientUserServiceMock = {
  ...baseServiceMock,
}

describe('FileAssignmentService', () => {
  let fileAssignmentService: FileAssignmentService
  let fileAssignmentRepo: Repository<FileAssignment>
  let assignmentService: AssignmentService

  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [
        FileAssignmentService,
        LessonService,
        AssignmentService,
        GroupAssignmentService,
        ClientUserService,
        {
          provide: getRepositoryToken(FileAssignment),
          useFactory: repositoryMockFactory,
        },
      ],
    })

    setupTestModule.overrideProvider(LessonService).useValue(lessonServiceMock)
    setupTestModule
      .overrideProvider(AssignmentService)
      .useValue(assignmentServiceMock)
    setupTestModule
      .overrideProvider(GroupAssignmentService)
      .useValue(groupAssignmentServiceMock)
    setupTestModule
      .overrideProvider(ClientUserService)
      .useValue(clientUserServiceMock)

    const compiledModule = await setupTestModule.compile()

    fileAssignmentRepo = compiledModule.get(getRepositoryToken(FileAssignment))
    fileAssignmentService = compiledModule.get(FileAssignmentService)
    assignmentService = compiledModule.get(AssignmentService)
  })

  describe('create', () => {
    let data: FileAssignmentSetInput
    let lesson: Lesson
    beforeAll(() => {
      data = {
        title: 'Title 1',
        description: 'description 1',
        maxScore: 200,
        estimateTimeInMinute: 30,
        contentInstruct: null,
        videoInstruct: null,
        explainContent: null,
        explainVideo: null,
        lessonId: '1',
      }
      lesson = createLessonEntityMock()
    })

    beforeEach(() => {
      jest.spyOn(lessonServiceMock, 'findById').mockResolvedValue(lesson)
    })
    it("If assignment doesn't exist, it should create new assignment", async () => {
      lesson.assignment = null

      const createAssign = jest
        .spyOn(assignmentService, 'createAssignment')
        .mockResolvedValue(createAssignmentEntityMock())

      jest
        .spyOn(fileAssignmentRepo, 'save')
        .mockImplementation(async (data: FileAssignment) =>
          createFileAssignmentEntityMock({
            title: data.title,
            description: data.description,
            maxScore: data.maxScore,
            estimateTimeInMinute: data.estimateTimeInMinute,
            contentInstruct: data.contentInstruct,
            videoInstruct: data.videoInstruct,
            explainContent: data.explainContent,
            explainVideo: data.explainVideo,
            assignment: data.assignment,
          })
        )

      const result = await fileAssignmentService.create(data)

      expect(result).toEqual(
        createFileAssignmentEntityMock({
          title: data.title,
          description: data.description,
          maxScore: data.maxScore,
          estimateTimeInMinute: data.estimateTimeInMinute,
          contentInstruct: data.contentInstruct,
          videoInstruct: data.videoInstruct,
          explainContent: data.explainContent,
          explainVideo: data.explainVideo,
          assignment: createAssignmentEntityMock(),
        })
      )

      expect(createAssign).toHaveBeenCalled()
    })

    it('If assignment exist, it should update that assignment', async () => {
      lesson.assignment = createAssignmentEntityMock()

      const findAssign = jest
        .spyOn(assignmentServiceMock, 'findById')
        .mockResolvedValue(createAssignmentEntityMock())

      jest
        .spyOn(fileAssignmentRepo, 'save')
        .mockImplementation(async (data: FileAssignment) =>
          createFileAssignmentEntityMock({
            title: data.title,
            description: data.description,
            maxScore: data.maxScore,
            estimateTimeInMinute: data.estimateTimeInMinute,
            contentInstruct: data.contentInstruct,
            videoInstruct: data.videoInstruct,
            explainContent: data.explainContent,
            explainVideo: data.explainVideo,
            assignment: data.assignment,
          })
        )
      const result = await fileAssignmentService.create(data)

      expect(result).toEqual(
        createFileAssignmentEntityMock({
          title: data.title,
          description: data.description,
          maxScore: data.maxScore,
          estimateTimeInMinute: data.estimateTimeInMinute,
          contentInstruct: data.contentInstruct,
          videoInstruct: data.videoInstruct,
          explainContent: data.explainContent,
          explainVideo: data.explainVideo,
          assignment: createAssignmentEntityMock(),
        })
      )

      expect(findAssign).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    let data: FileAssignmentSetInput
    let lesson: Lesson
    let fileAssignment: FileAssignment
    beforeAll(() => {
      data = {
        title: 'Title 2',
        description: 'description 2',
        maxScore: 200,
        estimateTimeInMinute: 30,
        contentInstruct: null,
        videoInstruct: null,
        explainContent: null,
        explainVideo: null,
        lessonId: '1',
      }
      lesson = createLessonEntityMock({
        assignment: createAssignmentEntityMock(),
      })
      fileAssignment = createFileAssignmentEntityMock()
    })

    beforeEach(() => {
      jest.spyOn(lessonServiceMock, 'findById').mockResolvedValue(lesson)
      jest
        .spyOn(fileAssignmentService, 'findById')
        .mockResolvedValue(fileAssignment)
    })

    it("If Lesson doesn't contain fileAssignment, it should throw Error", async () => {
      fileAssignment.assignment = createAssignmentEntityMock({ id: '2' })

      assertThrowError(
        fileAssignmentService.update.bind(fileAssignmentService, 'id', data),
        new BadRequestException(
          `Lesson with id ${lesson.id} is not contain this file assignment`
        )
      )
    })

    it('It should update FileAssignment', async () => {
      fileAssignment.assignment = createAssignmentEntityMock()

      jest
        .spyOn(fileAssignmentRepo, 'save')
        .mockImplementation(async (data: FileAssignment) =>
          createFileAssignmentEntityMock({
            ...data,
            id: '2',
          })
        )

      const result = await fileAssignmentService.update('id', data)

      expect(result).toEqual(
        createFileAssignmentEntityMock({
          id: '2',
          title: data.title,
          description: data.description,
          maxScore: data.maxScore,
          estimateTimeInMinute: data.estimateTimeInMinute,
          assignment: createAssignmentEntityMock(),
        })
      )
    })
  })

  describe('delete', () => {
    it('It should remove fileAssignment', async () => {
      jest.spyOn(fileAssignmentService, 'findById').mockResolvedValue(
        createFileAssignmentEntityMock({
          assignment: createAssignmentEntityMock(),
        })
      )
      jest.spyOn(fileAssignmentService, 'deleteOneById').mockResolvedValue({
        raw: null,
        affected: null,
      })

      const deleteAssign = jest.spyOn(assignmentServiceMock, 'deleteAssign')

      const result = await fileAssignmentService.delete('id')

      expect(result).toEqual(true)
      expect(deleteAssign).toHaveBeenCalled()
    })
  })

  describe('firstSubmit', () => {
    let data: SubmitInput
    let fileAssign: FileAssignment
    let user: ClientUser
    beforeEach(() => {
      fileAssign = createFileAssignmentEntityMock()
      user = createClientUserEntityMock()

      data = {
        title: 'Submit 1',
        courseId: '1',
      }

      jest
        .spyOn(fileAssignmentService, 'findById')
        .mockResolvedValue(fileAssign)
      jest.spyOn(clientUserServiceMock, 'findById').mockResolvedValue(user)
    })

    it("If groupAssignment doesn't exist, it should create new groupAssignment", async () => {
      fileAssign.submittedGroupAssignments = null
      user.submittedGroupAssignments = null

      const createGroupAssign = jest
        .spyOn(groupAssignmentServiceMock, 'create')
        .mockResolvedValue(
          createGroupAssignmentEntityMock({
            user,
            submitteds: [createSubmittedEntityMock({ title: data.title })],
          })
        )
      const save = jest
        .spyOn(fileAssignmentRepo, 'save')
        .mockImplementation(async (data) =>
          createFileAssignmentEntityMock({ ...data } as FileAssignment)
        )

      const result = await fileAssignmentService.firstSubmit(
        'id',
        data,
        'userId'
      )

      expect(result).toEqual(
        createGroupAssignmentEntityMock({
          user,
          submitteds: [createSubmittedEntityMock({ title: 'Submit 1' })],
        })
      )
      expect(createGroupAssign).toHaveBeenCalled()
      expect(save).toHaveBeenCalled()
      expect(fileAssign.submittedGroupAssignments.length).toEqual(1)
    })

    describe('If groupAssignment exist', () => {
      it('If group is created by user, it should throw Error', async () => {
        fileAssign.submittedGroupAssignments = [
          createGroupAssignmentEntityMock(),
          createGroupAssignmentEntityMock({ id: '2' }),
          createGroupAssignmentEntityMock({ id: '3' }),
        ]
        user.submittedGroupAssignments = [
          createGroupAssignmentEntityMock(),
          createGroupAssignmentEntityMock({ id: '4' }),
          createGroupAssignmentEntityMock({ id: '5' }),
        ]

        assertThrowError(
          fileAssignmentService.firstSubmit.bind(
            fileAssignmentService,
            'id',
            data,
            'userId'
          ),
          new BadRequestException('Group is already exist')
        )
      })

      it('It should add new groupAssignment', async () => {
        fileAssign.submittedGroupAssignments = [
          createGroupAssignmentEntityMock(),
          createGroupAssignmentEntityMock({ id: '2' }),
          createGroupAssignmentEntityMock({ id: '3' }),
        ]
        user.submittedGroupAssignments = [
          createGroupAssignmentEntityMock({ id: '6' }),
          createGroupAssignmentEntityMock({ id: '4' }),
          createGroupAssignmentEntityMock({ id: '5' }),
        ]

        const createGroupAssign = jest
          .spyOn(groupAssignmentServiceMock, 'create')
          .mockResolvedValue(
            createGroupAssignmentEntityMock({
              submitteds: [createSubmittedEntityMock({ title: data.title })],
              user,
            })
          )
        const save = jest
          .spyOn(fileAssignmentRepo, 'save')
          .mockImplementation(async (data) =>
            createFileAssignmentEntityMock({ ...data } as FileAssignment)
          )

        const result = await fileAssignmentService.firstSubmit(
          'id',
          data,
          'userId'
        )
        expect(result).toEqual(
          createGroupAssignmentEntityMock({
            submitteds: [createSubmittedEntityMock({ title: 'Submit 1' })],
            user,
          })
        )
        expect(createGroupAssign).toHaveBeenCalled()
        expect(save).toHaveBeenCalled()
        expect(fileAssign.submittedGroupAssignments.length).toEqual(4)
      })
    })
  })

  describe('submit', () => {
    let data: SubmitInput
    beforeEach(() => {
      data = {
        title: 'Submit 2',
        courseId: '1',
        groupAssignmentId: '1',
      }
    })
    it('It should add new submit to group', async () => {
      jest.spyOn(groupAssignmentServiceMock, 'update').mockResolvedValue(
        createGroupAssignmentEntityMock({
          submitteds: [createSubmittedEntityMock({ title: data.title })],
        })
      )

      const result = await fileAssignmentService.submit('id', data, 'userId')

      expect(result).toEqual(
        createGroupAssignmentEntityMock({
          submitteds: [createSubmittedEntityMock({ title: 'Submit 2' })],
        })
      )
    })
  })

  describe('evaluation', () => {
    let data: EvaluationInput

    beforeEach(() => {
      data = {
        reApply: true,
        score: 30,
        order: 1,
      }
    })
    it('It add evaluation to group', async () => {
      jest.spyOn(groupAssignmentServiceMock, 'evaluation').mockResolvedValue(
        createGroupAssignmentEntityMock({
          previousScore: data.score,
          submitteds: [
            createSubmittedEntityMock({
              reApply: data.reApply,
              order: data.order,
            }),
          ],
        })
      )

      const result = await fileAssignmentService.evaluation('id', data, 'token')

      expect(result).toEqual(
        createGroupAssignmentEntityMock({
          previousScore: 30,
          submitteds: [
            createSubmittedEntityMock({
              reApply: true,
              order: 1,
            }),
          ],
        })
      )
    })
  })

  describe('searchGroupAssign', () => {
    let searchOpt: SearchOptionInput
    let qb
    beforeEach(() => {
      qb = jest.spyOn(fileAssignmentRepo, 'createQueryBuilder').mock.results
    })
    it('If search custom fields', async () => {
      searchOpt = {
        searchString: 'search String',
        searchFields: ['user.name', 'user.email'],
      }

      const result = await fileAssignmentService.searchGroupAssign(
        'id',
        searchOpt
      )
      const mockMethodCalleds = qb[0].value.mockMethodCalleds

      expect(result).toEqual({})
      expect(mockMethodCalleds.length).toEqual(6)
      expect(
        QueryBuilderMock.countMethodCalleds(mockMethodCalleds, 'where')
      ).toEqual(2)
      expect(
        QueryBuilderMock.countMethodCalleds(
          mockMethodCalleds,
          'innerJoinAndSelect'
        )
      ).toEqual(2)
      expect(
        QueryBuilderMock.countMethodCalleds(mockMethodCalleds, 'andWhere')
      ).toEqual(1)
      expect(
        QueryBuilderMock.countMethodCalleds(mockMethodCalleds, 'orWhere')
      ).toEqual(1)
    })

    it('If have least one field of groupAssignment', async () => {
      searchOpt = {
        searchString: 'search String',
        searchFields: ['title', 'user.email', 'user.name'],
      }

      const result = await fileAssignmentService.searchGroupAssign(
        'id',
        searchOpt
      )
      const mockMethodCalleds = qb[1].value.mockMethodCalleds

      expect(result).toEqual({})
      expect(mockMethodCalleds.length).toEqual(7)
      expect(
        QueryBuilderMock.countMethodCalleds(mockMethodCalleds, 'where')
      ).toEqual(2)
      expect(
        QueryBuilderMock.countMethodCalleds(
          mockMethodCalleds,
          'innerJoinAndSelect'
        )
      ).toEqual(2)
      expect(
        QueryBuilderMock.countMethodCalleds(mockMethodCalleds, 'andWhere')
      ).toEqual(1)
      expect(
        QueryBuilderMock.countMethodCalleds(mockMethodCalleds, 'orWhere')
      ).toEqual(2)
    })
  })

  describe('viewSubmitAssign', () => {
    it('It should return true', async () => {
      jest
        .spyOn(groupAssignmentServiceMock, 'viewSubmitted')
        .mockResolvedValue(true)

      const result = await fileAssignmentService.viewSubmittedAssign('id', 1)

      expect(result).toEqual(true)
    })
  })
})
