import { Test } from '@nestjs/testing'
import { GroupAssignment } from 'src/assignment/entities/fileAssignment/groupAssignment.entity'
import { GroupAssignmentService } from 'src/assignment/services/fileAssignment/groupAssignment.service'
import { baseServiceMock } from 'src/common/mock/baseServiceMock'
import {
  createClientUserEntityMock,
  createFileAssignmentEntityMock,
  createGroupAssignmentEntityMock,
  createSubmittedEntityMock,
} from 'src/common/mock/mockEntity'
import { PaginationInput } from 'src/graphql'
import { GroupAssignmentTypeResolver } from '../../fileAssignment/groupAssignmentType.resolver'

const groupAssignServiceMock = {
  ...baseServiceMock,
  async manuallyPagination() {
    return Promise.resolve({})
  },
}

describe('GroupAssignmentTypeResolver', () => {
  let resolver: GroupAssignmentTypeResolver
  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [GroupAssignmentTypeResolver, GroupAssignmentService],
    })

    setupTestModule
      .overrideProvider(GroupAssignmentService)
      .useValue(groupAssignServiceMock)

    const compliedModule = await setupTestModule.compile()

    resolver = compliedModule.get(GroupAssignmentTypeResolver)
  })

  let parent: GroupAssignment

  beforeEach(() => {
    parent = createGroupAssignmentEntityMock()
  })

  describe('user', () => {
    beforeEach(() => {
      parent.user = createClientUserEntityMock()
      jest.spyOn(groupAssignServiceMock, 'findById').mockResolvedValue(parent)
    })

    it('It should return user', async () => {
      const result = await resolver.user(parent)

      expect(result).toEqual(createClientUserEntityMock())
    })
  })

  describe('submitteds', () => {
    let pagination: PaginationInput
    beforeEach(() => {
      parent.submitteds = [
        createSubmittedEntityMock(),
        createSubmittedEntityMock({ id: '2' }),
      ]

      pagination = {
        skip: 1,
        limit: 10,
      }
      jest.spyOn(groupAssignServiceMock, 'findById').mockResolvedValue(parent)
    })

    it('It should return submittes', async () => {
      const manuallyPagination = jest
        .spyOn(groupAssignServiceMock, 'manuallyPagination')
        .mockResolvedValue(parent.submitteds)

      const result = await resolver.submitteds(parent, pagination)

      expect(result).toEqual([
        createSubmittedEntityMock(),
        createSubmittedEntityMock({ id: '2' }),
      ])
      expect(manuallyPagination).toHaveBeenCalled()
    })
  })

  describe('fileAssignment', () => {
    beforeEach(() => {
      parent.fileAssignment = createFileAssignmentEntityMock()
      jest.spyOn(groupAssignServiceMock, 'findById').mockResolvedValue(parent)
    })

    it('It should return fileAssignment', async () => {
      const result = await resolver.fileAssignment(parent)

      expect(result).toEqual(createFileAssignmentEntityMock())
    })
  })
})
