import { BadRequestException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { GroupAssignment } from 'src/assignment/entities/fileAssignment/groupAssignment.entity'
import { ClientUserService } from 'src/clientUser/services/clientUser.service'
import { baseServiceMock } from 'src/common/mock/baseServiceMock'
import { assertThrowError } from 'src/common/mock/customAssertion'
import {
  createClientUserEntityMock,
  createFileAssignmentEntityMock,
  createGroupAssignmentEntityMock,
  createSubmittedEntityMock,
} from 'src/common/mock/mockEntity'
import { repositoryMockFactory } from 'src/common/mock/repositoryMock'
import { EvaluationInput, SubmitInput } from 'src/graphql'
import { Repository } from 'typeorm'
import { GroupAssignmentService } from '../../fileAssignment/groupAssignment.service'
import { SubmittedAssignmentService } from '../../fileAssignment/submittedAssignment.service'

const clientUserServiceMock = {
  ...baseServiceMock,
  async updateScore() {
    return Promise.resolve({})
  },
}
const submittedAssignServiceMock = {
  async submit() {
    return Promise.resolve({})
  },

  async evaluation() {
    return Promise.resolve({})
  },

  async view() {
    return Promise.resolve(true)
  },
}

describe('GroupAssignmentService', () => {
  let groupAssignService: GroupAssignmentService
  let groupAssignRepo: Repository<GroupAssignment>
  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [
        GroupAssignmentService,
        ClientUserService,
        SubmittedAssignmentService,
        {
          provide: getRepositoryToken(GroupAssignment),
          useFactory: repositoryMockFactory,
        },
      ],
    })

    setupTestModule
      .overrideProvider(ClientUserService)
      .useValue(clientUserServiceMock)
    setupTestModule
      .overrideProvider(SubmittedAssignmentService)
      .useValue(submittedAssignServiceMock)

    const compiledModule = await setupTestModule.compile()

    groupAssignRepo = compiledModule.get(getRepositoryToken(GroupAssignment))
    groupAssignService = compiledModule.get(GroupAssignmentService)
  })

  describe('create', () => {
    let data: SubmitInput

    beforeEach(() => {
      data = {
        title: 'Submit 1',
        description: 'Description 1',
        courseId: '1',
      }

      jest
        .spyOn(clientUserServiceMock, 'findById')
        .mockResolvedValue(createClientUserEntityMock({ name: 'user 1' }))
      jest
        .spyOn(submittedAssignServiceMock, 'submit')
        .mockResolvedValue(createSubmittedEntityMock())
    })

    it('It should create new groupAssignment', async () => {
      jest
        .spyOn(groupAssignRepo, 'save')
        .mockImplementation(async (data) =>
          createGroupAssignmentEntityMock({ ...data } as GroupAssignment)
        )

      const result = await groupAssignService.create(data, 'userId')

      expect(result).toEqual(
        createGroupAssignmentEntityMock({
          title: 'user 1',
          user: createClientUserEntityMock({ name: 'user 1' }),
          submitteds: [createSubmittedEntityMock()],
        })
      )
    })
  })

  describe('update', () => {
    let data: SubmitInput
    let groupAssignment: GroupAssignment
    beforeEach(() => {
      data = {
        title: 'Submit 1',
        description: 'Description 1',
        courseId: '1',
        groupAssignmentId: 'id',
      }

      groupAssignment = createGroupAssignmentEntityMock({
        user: createClientUserEntityMock({ id: '1' }),
        submitteds: [createSubmittedEntityMock()],
        fileAssignment: createFileAssignmentEntityMock(),
      })

      jest
        .spyOn(groupAssignService, 'findById')
        .mockResolvedValue(groupAssignment)
    })
    afterEach(() => {
      jest.resetAllMocks()
    })

    it("If assignment doesn't contain submitted assignment, it should throw Error", async () => {
      assertThrowError(
        groupAssignService.update.bind(
          groupAssignService,
          'id',
          data,
          'userId'
        ),
        new BadRequestException(
          `this assignment doesn't contain submitted assignment with id ${data.groupAssignmentId}`
        )
      )
    })

    it("If user doesn't owner of groupAssignment, it should throw Error", async () => {
      assertThrowError(
        groupAssignService.update.bind(
          groupAssignService,
          '2f8bdfa5-454a-2304-cs5d-3456ac3dd78d4',
          data,
          'userId'
        ),
        new BadRequestException("user with id userId can't excute this action")
      )
    })

    it('If lenght of submitteds is 0, it should define new submitteds', async () => {
      groupAssignment.submitteds = null

      const submit = jest
        .spyOn(submittedAssignServiceMock, 'submit')
        .mockResolvedValue(
          createSubmittedEntityMock({
            title: 'Submit 1',
            description: 'Description 1',
            id: '2',
          })
        )

      jest
        .spyOn(groupAssignRepo, 'save')
        .mockImplementation(async (data) =>
          createGroupAssignmentEntityMock({ ...data } as GroupAssignment)
        )

      const result = await groupAssignService.update(
        '2f8bdfa5-454a-2304-cs5d-3456ac3dd78d4',
        data,
        '1'
      )

      expect(result).toEqual(
        createGroupAssignmentEntityMock({
          isUpdated: true,
          user: createClientUserEntityMock({ id: '1' }),
          submitteds: [
            createSubmittedEntityMock({
              title: 'Submit 1',
              description: 'Description 1',
              id: '2',
            }),
          ],
          fileAssignment: createFileAssignmentEntityMock(),
        })
      )
      expect(submit).toHaveBeenCalled()
    })

    it('If length submitteds is greater than 0, it should add new groupAssignment', async () => {
      const submit = jest
        .spyOn(submittedAssignServiceMock, 'submit')
        .mockResolvedValue(
          createSubmittedEntityMock({
            title: 'Submit 1',
            description: 'Description 1',
            id: '2',
          })
        )

      jest
        .spyOn(groupAssignRepo, 'save')
        .mockImplementation(async (data) =>
          createGroupAssignmentEntityMock({ ...data } as GroupAssignment)
        )

      const result = await groupAssignService.update(
        '2f8bdfa5-454a-2304-cs5d-3456ac3dd78d4',
        data,
        '1'
      )

      expect(result).toEqual(
        createGroupAssignmentEntityMock({
          isUpdated: true,
          user: createClientUserEntityMock({ id: '1' }),
          submitteds: [
            createSubmittedEntityMock(),
            createSubmittedEntityMock({
              title: 'Submit 1',
              description: 'Description 1',
              id: '2',
            }),
          ],
          fileAssignment: createFileAssignmentEntityMock(),
        })
      )
      expect(submit).toHaveBeenCalled()
    })
  })

  describe('evaluation', () => {
    let data: EvaluationInput
    let groupAssignment: GroupAssignment
    beforeEach(() => {
      data = {
        order: 1,
      }

      groupAssignment = createGroupAssignmentEntityMock({
        user: createClientUserEntityMock({ id: '1' }),
        submitteds: [
          createSubmittedEntityMock(),
          createSubmittedEntityMock({ id: '2' }),
        ],
        fileAssignment: createFileAssignmentEntityMock(),
      })

      jest
        .spyOn(groupAssignService, 'findById')
        .mockResolvedValue(groupAssignment)
    })

    it("If submitted doesn't exist, it should throw Error", async () => {
      data.order = 3
      assertThrowError(
        groupAssignService.evaluation.bind(
          groupAssignService,
          'id',
          data,
          'token'
        ),
        new BadRequestException(
          `Submitted with order = ${data.order} doesn't exist`
        )
      )
    })
    describe('If score is provided', () => {
      beforeEach(() => {
        data.order = 1
      })
      it('If score is negative number, it should throw Error', async () => {
        data.score = -30

        assertThrowError(
          groupAssignService.evaluation.bind(
            groupAssignService,
            'id',
            data,
            'token'
          ),
          new BadRequestException('A score should be a positive number')
        )
      })

      it('If score is greater than maxScore, it should re-assign score', async () => {
        data.score = 150
        const updateScore = jest.spyOn(clientUserServiceMock, 'updateScore')
        const save = jest
          .spyOn(groupAssignRepo, 'save')
          .mockImplementation(async (data) =>
            createGroupAssignmentEntityMock({ ...data } as GroupAssignment)
          )
        const evaluation = jest.spyOn(submittedAssignServiceMock, 'evaluation')

        const result = await groupAssignService.evaluation('id', data, 'token')

        expect(result).toEqual(
          createGroupAssignmentEntityMock({
            previousScore: 100,
            user: createClientUserEntityMock({ id: '1' }),
            submitteds: [
              createSubmittedEntityMock(),
              createSubmittedEntityMock({ id: '2' }),
            ],
            fileAssignment: createFileAssignmentEntityMock(),
          })
        )
        expect(updateScore).toHaveBeenCalled()
        expect(save).toHaveBeenCalled()
        expect(evaluation).toHaveBeenCalled()
      })

      it('If score is 0', async () => {
        data.score = 0
        const updateScore = jest.spyOn(clientUserServiceMock, 'updateScore')
        const save = jest
          .spyOn(groupAssignRepo, 'save')
          .mockImplementation(async (data) =>
            createGroupAssignmentEntityMock({ ...data } as GroupAssignment)
          )
        const evaluation = jest.spyOn(submittedAssignServiceMock, 'evaluation')

        const result = await groupAssignService.evaluation('id', data, 'token')

        expect(result).toEqual(
          createGroupAssignmentEntityMock({
            previousScore: 0,
            user: createClientUserEntityMock({ id: '1' }),
            submitteds: [
              createSubmittedEntityMock(),
              createSubmittedEntityMock({ id: '2' }),
            ],
            fileAssignment: createFileAssignmentEntityMock(),
          })
        )
        expect(updateScore).toHaveBeenCalled()
        expect(save).toHaveBeenCalled()
        expect(evaluation).toHaveBeenCalled()
      })
    })
  })

  describe('delete', () => {
    it('It should delete groupAssignment', async () => {
      const deleteOneById = jest
        .spyOn(groupAssignService, 'deleteOneById')
        .mockResolvedValue({
          raw: null,
          affected: 0,
        })

      const result = await groupAssignService.delete('id')

      expect(result).toEqual(true)
      expect(deleteOneById).toHaveBeenCalled()
    })
  })

  describe('viewSubmitted', () => {
    let groupAssignment: GroupAssignment
    let fnView
    beforeEach(() => {
      groupAssignment = createGroupAssignmentEntityMock({
        submitteds: [createSubmittedEntityMock()],
      })

      jest
        .spyOn(groupAssignService, 'findById')
        .mockResolvedValue(groupAssignment)
      fnView = jest.spyOn(submittedAssignServiceMock, 'view')
    })

    it("If submitted doesn't exist, it should throw Error", async () => {
      assertThrowError(
        groupAssignService.viewSubmitted.bind(groupAssignService, 'id', 2),
        new BadRequestException("Submitted with order = 2 doesn't exist")
      )
    })

    it('If have least one submitteds is new', async () => {
      const save = jest.spyOn(groupAssignRepo, 'save')

      const result = await groupAssignService.viewSubmitted('id', 1)

      expect(result).toEqual(true)
      expect(fnView).toHaveBeenCalled()
      expect(save).toHaveBeenCalled()
    })
  })
})
