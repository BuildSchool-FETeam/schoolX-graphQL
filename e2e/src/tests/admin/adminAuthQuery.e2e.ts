import { ADMIN_USERS } from 'e2e/src/gql/admin.gql'
import { IAdminUserQuery } from 'e2e/src/interfaces/admin.interfaces'
import {
  PaginationInput,
  SearchOptionInput,
} from 'e2e/src/interfaces/base.interface'
import { gqlRequest } from 'e2e/src/utils/api-call'
import { createAdmin, DEFAULT_EMAIL, signIn } from 'e2e/src/utils/authUtils'
import { SECONDARY_PERM } from 'e2e/src/utils/setup'
import { removeAllCreatedPermissions } from 'e2e/src/utils/teardown'

describe('AdminAuthQuery endpoint. #auth #admin', () => {
  let token: string
  const now = Date.now()

  beforeAll(async () => {
    token = await signIn()
    const dataArr = [
      {
        email: `test${now}-1@test.com`,
        name: 'test',
        password: 'Test1234',
        role: SECONDARY_PERM,
      },
      {
        email: `test${now}-2@test.com`,
        name: 'test2',
        password: 'Test1234',
        role: SECONDARY_PERM,
      },
    ]
    // Create admins
    await createAdmin(dataArr[0], token)
    await createAdmin(dataArr[1], token)
  })

  afterAll(async () => {
    removeAllCreatedPermissions(token)
  })

  describe('adminUsers', () => {
    it('should list adminUsers without any params', async () => {
      const response = await gqlRequest<IAdminUserQuery>(
        ADMIN_USERS,
        undefined,
        token
      )
      const adminUsers = response.adminUserQuery.adminUsers

      const expectResults = [
        {
          __typename: 'AdminUser',
          createdBy: null,
          name: 'Admin Ultimate',
          role: 'ultimateAdmin',
          email: DEFAULT_EMAIL,
        },
        {
          email: `test${now}-1@test.com`,
          name: 'test',
          role: SECONDARY_PERM,
          __typename: 'AdminUser',
          createdBy: {
            email: DEFAULT_EMAIL,
          },
        },
        {
          email: `test${now}-2@test.com`,
          name: 'test2',
          role: SECONDARY_PERM,
          __typename: DEFAULT_EMAIL,
          createdBy: {
            email: DEFAULT_EMAIL,
          },
        },
      ]

      expect(adminUsers.length).toBe(3)

      expectResults.forEach((result) => {
        expect(
          adminUsers.some((aUser) => {
            return (
              aUser.email === result.email &&
              aUser.name === result.name &&
              aUser.role === result.role &&
              aUser.createdBy?.email === result.createdBy?.email
            )
          })
        ).toBe(true)
      })
    })

    it('should list 1 adminUser (ultimate) by params', async () => {
      const resData = await gqlRequest<
        IAdminUserQuery,
        { pagination: PaginationInput }
      >(ADMIN_USERS, { pagination: { limit: 1 } }, token)

      const adminUsers = resData.adminUserQuery.adminUsers

      expect(adminUsers.length).toBe(1)
      expect(adminUsers[0]).toEqual({
        createdBy: null,
        name: 'Admin Ultimate',
        role: 'ultimateAdmin',
        email: DEFAULT_EMAIL,
      })
    })

    it('should list 2 adminUser (without ultimate) by params', async () => {
      const resData = await gqlRequest<
        IAdminUserQuery,
        { pagination: PaginationInput }
      >(ADMIN_USERS, { pagination: { limit: 2, skip: 1 } }, token)

      const adminUsers = resData.adminUserQuery.adminUsers
      const expectResults = [
        {
          email: `test${now}-1@test.com`,
          name: 'test',
          role: SECONDARY_PERM,
          __typename: 'AdminUser',
          createdBy: {
            email: DEFAULT_EMAIL,
          },
        },
        {
          email: `test${now}-2@test.com`,
          name: 'test2',
          role: SECONDARY_PERM,
          __typename: DEFAULT_EMAIL,
          createdBy: {
            email: DEFAULT_EMAIL,
          },
        },
      ]

      expect(adminUsers.length).toBe(2)
      expectResults.forEach((result) => {
        expect(
          adminUsers.some((aUser) => {
            return (
              aUser.email === result.email &&
              aUser.name === result.name &&
              aUser.role === result.role &&
              aUser.createdBy?.email === result.createdBy?.email
            )
          })
        ).toBe(true)
      })
    })

    it('should return one true data with searchOption query', async () => {
      const resData = await gqlRequest<
        IAdminUserQuery,
        { search: SearchOptionInput }
      >(
        ADMIN_USERS,
        { search: { searchFields: ['email'], searchString: `test${now}-1` } },
        token
      )

      const adminUsers = resData.adminUserQuery.adminUsers

      expect(adminUsers.length).toBe(1)
      expect(adminUsers[0]).toEqual({
        email: `test${now}-1@test.com`,
        name: 'test',
        role: SECONDARY_PERM,

        createdBy: {
          email: DEFAULT_EMAIL,
        },
      })
    })

    it('should return one true data with searchOption query', async () => {
      const resData = await gqlRequest<
        IAdminUserQuery,
        { search: SearchOptionInput }
      >(
        ADMIN_USERS,
        { search: { searchFields: ['email', 'name'], searchString: `test2` } },
        token
      )

      const adminUsers = resData.adminUserQuery.adminUsers

      expect(adminUsers.length).toBe(1)
      expect(adminUsers[0]).toEqual({
        email: `test${now}-2@test.com`,
        name: 'test2',
        role: SECONDARY_PERM,
        createdBy: {
          email: DEFAULT_EMAIL,
        },
      })
    })

    it('should return one true data with searchOption, pagination query', async () => {
      const resData = await gqlRequest<
        IAdminUserQuery,
        { search: SearchOptionInput; pagination: PaginationInput }
      >(
        ADMIN_USERS,
        {
          search: { searchFields: ['name'], searchString: `test` },
          pagination: { limit: 1, skip: 0 },
        },
        token
      )

      const adminUsers = resData.adminUserQuery.adminUsers

      expect(adminUsers.length).toBe(1)
      expect(adminUsers[0]).toEqual({
        email: `test${now}-1@test.com`,
        name: 'test',
        role: SECONDARY_PERM,
        createdBy: {
          email: DEFAULT_EMAIL,
        },
      })
    })

    it('should list 2 adminUser (without ultimate) with full pagination params', async () => {
      const resData = await gqlRequest<
        IAdminUserQuery,
        { pagination: PaginationInput }
      >(
        ADMIN_USERS,
        {
          pagination: {
            limit: 2,
            skip: 1,
            order: { orderBy: 'name', direction: 'ASC' },
          },
        },
        token
      )

      const adminUsers = resData.adminUserQuery.adminUsers
      const expectResults = [
        {
          email: `test${now}-1@test.com`,
          name: 'test',
          role: SECONDARY_PERM,
          createdBy: {
            email: DEFAULT_EMAIL,
          },
        },
        {
          email: `test${now}-2@test.com`,
          name: 'test2',
          role: SECONDARY_PERM,
          createdBy: {
            email: DEFAULT_EMAIL,
          },
        },
      ]

      expect(adminUsers.length).toBe(2)
      expectResults.forEach((result, i) => {
        expect(result).toEqual(adminUsers[i])
      })
    })
  })
})
