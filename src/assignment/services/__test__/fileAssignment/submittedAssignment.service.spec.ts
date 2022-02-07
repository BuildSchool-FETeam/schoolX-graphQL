import { BadRequestException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { SubmittedAssignment } from 'src/assignment/entities/fileAssignment/SubmittedAssignment.entity'
import { assertThrowError } from 'src/common/mock/customAssertion'
import {
  createEvaluationCommentEntityMock,
  createSubmittedEntityMock,
} from 'src/common/mock/mockEntity'
import { repositoryMockFactory } from 'src/common/mock/repositoryMock'
import { GCStorageService } from 'src/common/services/GCStorage.service'
import { EvaluationInput, SubmitInput } from 'src/graphql'
import { Repository } from 'typeorm'
import { EvaluationCommentService } from '../../fileAssignment/evaluationComment.service'
import { SubmittedAssignmentService } from '../../fileAssignment/submittedAssignment.service'

const gcStorageServiceMock = {
  async uploadFile() {
    return Promise.resolve({})
  },
}
const evalutaionCommentServiceMock = {
  async setComment() {
    return Promise.resolve({})
  },
}

describe('SubmittedAssignmentService', () => {
  let submittedAssignService: SubmittedAssignmentService
  let submittedAssignRepo: Repository<SubmittedAssignment>
  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [
        SubmittedAssignmentService,
        GCStorageService,
        EvaluationCommentService,
        {
          provide: getRepositoryToken(SubmittedAssignment),
          useFactory: repositoryMockFactory,
        },
      ],
    })

    setupTestModule
      .overrideProvider(GCStorageService)
      .useValue(gcStorageServiceMock)
    setupTestModule
      .overrideProvider(EvaluationCommentService)
      .useValue(evalutaionCommentServiceMock)

    const compliedModule = await setupTestModule.compile()

    submittedAssignService = compliedModule.get(SubmittedAssignmentService)
    submittedAssignRepo = compliedModule.get(
      getRepositoryToken(SubmittedAssignment)
    )
  })

  describe('submit', () => {
    let data: SubmitInput

    beforeEach(() => {
      data = {
        title: 'Submitted 1',
        courseId: 'id',
      }
    })

    describe('If upload file', () => {
      beforeEach(() => {
        data.file = {
          filename: 'file.png',
          minetype: 'type',
          encoding: 'utf-8',
          createReadStream() {
            return {}
          },
        }
      })

      it("If format doesn't zip, it should throw Error", async () => {
        assertThrowError(
          submittedAssignService.submit.bind(submittedAssignService, data),
          new BadRequestException('you can only upload file .zip')
        )
      })

      it('It should upload file', async () => {
        data.file.filename = 'file.zip'

        const uploadFile = jest
          .spyOn(gcStorageServiceMock, 'uploadFile')
          .mockResolvedValue({
            publicUrl: 'url',
            filePath: 'file',
          })

        const save = jest
          .spyOn(submittedAssignRepo, 'save')
          .mockImplementation(async (data) =>
            createSubmittedEntityMock({
              title: data.title,
              fileUrl: data.fileUrl,
            })
          )

        const result = await submittedAssignService.submit(data)

        expect(result).toEqual(
          createSubmittedEntityMock({
            title: 'Submitted 1',
            fileUrl: 'url',
          })
        )
        expect(uploadFile).toHaveBeenCalled()
        expect(save).toHaveBeenCalled()
      })
    })

    it('If without upload file', async () => {
      const save = jest
        .spyOn(submittedAssignRepo, 'save')
        .mockImplementation(async (data) =>
          createSubmittedEntityMock({
            title: data.title,
            fileUrl: data.fileUrl,
          })
        )

      const result = await submittedAssignService.submit(data)

      expect(result).toEqual(
        createSubmittedEntityMock({
          title: 'Submitted 1',
          fileUrl: null,
        })
      )
      expect(save).toHaveBeenCalled()
    })
  })

  describe('evaluation', () => {
    let submitted: SubmittedAssignment
    let data: EvaluationInput
    beforeEach(() => {
      submitted = createSubmittedEntityMock({
        comments: [createEvaluationCommentEntityMock()],
      })

      data = {
        reApply: true,
        score: 50,
        order: 1,
        comment: null,
      }

      jest
        .spyOn(submittedAssignService, 'findById')
        .mockResolvedValue(submitted)
    })

    describe('If have comment', () => {
      beforeEach(() => {
        data.comment = {
          id: '1',
          content: 'content',
        }
      })

      it('If length of comments is 0', async () => {
        submitted.comments = null

        const setComment = jest
          .spyOn(evalutaionCommentServiceMock, 'setComment')
          .mockResolvedValue(
            createEvaluationCommentEntityMock({
              id: data.comment.id,
              content: data.comment.content,
            })
          )

        const save = jest
          .spyOn(submittedAssignRepo, 'save')
          .mockImplementation(async (data) =>
            createSubmittedEntityMock({
              reApply: data.reApply,
              comments: [
                createEvaluationCommentEntityMock({
                  content: 'content',
                }),
              ],
            })
          )

        const result = await submittedAssignService.evaluation(
          'id',
          data,
          'token'
        )

        expect(result).toEqual(
          createSubmittedEntityMock({
            comments: [
              createEvaluationCommentEntityMock({
                content: data.comment.content,
              }),
            ],
            reApply: data.reApply,
          })
        )
        expect(setComment).toHaveBeenCalled()
        expect(save).toHaveBeenCalled()
      })

      it('If length of comments is greater than 0', async () => {
        const setComment = jest
          .spyOn(evalutaionCommentServiceMock, 'setComment')
          .mockResolvedValue(
            createEvaluationCommentEntityMock({
              id: data.comment.id,
              content: data.comment.content,
            })
          )

        const save = jest
          .spyOn(submittedAssignRepo, 'save')
          .mockImplementation(async (data) =>
            createSubmittedEntityMock({
              reApply: data.reApply,
              comments: [
                createEvaluationCommentEntityMock(),
                createEvaluationCommentEntityMock({
                  content: 'content',
                }),
              ],
            })
          )

        const result = await submittedAssignService.evaluation(
          'id',
          data,
          'token'
        )

        expect(result).toEqual(
          createSubmittedEntityMock({
            comments: [
              createEvaluationCommentEntityMock(),
              createEvaluationCommentEntityMock({
                content: data.comment.content,
              }),
            ],
            reApply: data.reApply,
          })
        )
        expect(setComment).toHaveBeenCalled()
        expect(save).toHaveBeenCalled()
      })
    })

    it("If doesn't comment", async () => {
      const save = jest
        .spyOn(submittedAssignRepo, 'save')
        .mockImplementation(async (data) =>
          createSubmittedEntityMock({
            reApply: data.reApply,
            comments: [createEvaluationCommentEntityMock()],
          })
        )

      const result = await submittedAssignService.evaluation(
        'id',
        data,
        'token'
      )

      expect(result).toEqual(
        createSubmittedEntityMock({
          reApply: true,
          comments: [createEvaluationCommentEntityMock()],
        })
      )
      expect(save).toHaveBeenCalled()
    })
  })

  describe('view', () => {
    beforeEach(() => {
      jest
        .spyOn(submittedAssignService, 'findById')
        .mockResolvedValue(createSubmittedEntityMock())
    })

    it('It should return true', async () => {
      const save = jest.spyOn(submittedAssignRepo, 'save')
      const result = await submittedAssignService.view('id')

      expect(result).toEqual(true)
      expect(save).toHaveBeenCalled()
    })
  })
})
