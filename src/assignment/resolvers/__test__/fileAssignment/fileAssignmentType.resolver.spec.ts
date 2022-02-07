import { Test } from '@nestjs/testing'
import { FileAssignment } from 'src/assignment/entities/fileAssignment/fileAssignment.entity'
import { FileAssignmentService } from 'src/assignment/services/fileAssignment/fileAssignment.service'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { baseServiceMock } from 'src/common/mock/baseServiceMock'
import { guardMock } from 'src/common/mock/guardMock'
import {
  createAssignmentEntityMock,
  createFileAssignmentEntityMock,
  createGroupAssignmentEntityMock,
} from 'src/common/mock/mockEntity'
import { PaginationInput, SearchOptionInput } from 'src/graphql'
import { FileAssignmentTypeResolver } from '../../fileAssignment/fileAssignmentType.resolver'

const fileAssignServiceMock = {
  ...baseServiceMock,
  async searchGroupAssign() {
    return Promise.resolve({})
  },

  async manuallyPagination() {
    return Promise.resolve({})
  },
}

describe('FileAssignmentTypeResolver', () => {
  let resolver: FileAssignmentTypeResolver
  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [FileAssignmentTypeResolver, FileAssignmentService],
    })

    setupTestModule
      .overrideProvider(FileAssignmentService)
      .useValue(fileAssignServiceMock)
    setupTestModule.overrideGuard(AuthGuard).useValue(guardMock)

    const compliedModule = await setupTestModule.compile()

    resolver = compliedModule.get(FileAssignmentTypeResolver)
  })

  let parent: FileAssignment

  beforeEach(() => {
    parent = createFileAssignmentEntityMock()
  })

  describe('assignment', () => {
    beforeEach(() => {
      parent.assignment = createAssignmentEntityMock()
      jest.spyOn(fileAssignServiceMock, 'findById').mockResolvedValue(parent)
    })
    it('It should return assignment', async () => {
      const result = await resolver.assignment(parent)

      expect(result).toEqual(createAssignmentEntityMock())
    })
  })

  describe('submittedGroupAssignments', () => {
    let pagination: PaginationInput
    let searchOpt: SearchOptionInput
    beforeEach(() => {
      pagination = {
        skip: 1,
        limit: 10,
      }
      searchOpt = {
        searchFields: ['field 1', 'field 2'],
        searchString: '',
      }

      parent.submittedGroupAssignments = [
        createGroupAssignmentEntityMock(),
        createGroupAssignmentEntityMock({ id: '2' }),
      ]
    })
    it('If search result exist', async () => {
      jest
        .spyOn(fileAssignServiceMock, 'searchGroupAssign')
        .mockResolvedValue(parent)
      const manuallyPagination = jest
        .spyOn(fileAssignServiceMock, 'manuallyPagination')
        .mockResolvedValue(parent.submittedGroupAssignments)

      const result = await resolver.submittedGroupAssignments(
        parent,
        pagination,
        searchOpt
      )

      expect(result).toEqual([
        createGroupAssignmentEntityMock(),
        createGroupAssignmentEntityMock({ id: '2' }),
      ])
      expect(manuallyPagination).toHaveBeenCalled()
    })

    it("If search result doesn't exist", async () => {
      jest
        .spyOn(fileAssignServiceMock, 'searchGroupAssign')
        .mockResolvedValue(null)

      const result = await resolver.submittedGroupAssignments(
        parent,
        pagination,
        searchOpt
      )

      expect(result).toEqual([])
    })
  })
})
