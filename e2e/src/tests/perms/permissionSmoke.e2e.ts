import { createAdmin, signIn } from 'e2e/src/utils/authUtils'
import {
  setRole,
  deletePermissons,
  getPermById,
  getPermissionInput,
  getPermissions,
  hasRole,
} from 'e2e/src/utils/permissionUtils'
import { DEFAULT_PERMISSION, PASSWORD } from '../common/constant'
import { getErrMessage } from '../common/common.utils'

describe('permission smoke test', () => {
  let adminToken = ''
  const now = Date.now()
  const USER_A_PERM = 'UserA-Permission'
  const USER_B_PERM = 'UserB-Permission'

  let adminAToken = ''
  let adminBToken = ''

  const permissionIdA: string[] = []
  const permissionIdB: string[] = []
  const { DENINED, ROOT, OWNER_ONLY } = DEFAULT_PERMISSION

  beforeAll(async () => {
    // signin as admin user
    adminToken = await signIn()

    if (!(await hasRole(USER_A_PERM, adminToken))) {
      await setRole(
        {
          roleName: USER_A_PERM,
          course: ROOT,
          permission: ROOT,
          user: 'C:*|R:*|U:*|D:+',
          blog: ROOT,
          notification: DENINED,
          instructor: DENINED,
        },
        adminToken
      )
    }

    if (!(await hasRole(USER_B_PERM, adminToken))) {
      await setRole(
        {
          roleName: USER_B_PERM,
          course: OWNER_ONLY,
          permission: OWNER_ONLY,
          user: OWNER_ONLY,
          blog: OWNER_ONLY,
          notification: DENINED,
          instructor: DENINED,
        },
        adminToken
      )
    }

    // Admin
    const dataArr = [
      {
        email: `adminA_${now}-1@test.com`,
        name: 'test',
        password: PASSWORD,
        role: USER_A_PERM,
      },
      {
        email: `adminB_${now}-2@test.com`,
        name: 'test2',
        password: PASSWORD,
        role: USER_B_PERM,
      },
    ]
    // Create admins
    await createAdmin(dataArr[0], adminToken)
    await createAdmin(dataArr[1], adminToken)

    //signin
    adminAToken = await signIn(`adminA_${now}-1@test.com`, PASSWORD)
    adminBToken = await signIn(`adminB_${now}-2@test.com`, PASSWORD)
  })

  describe('Roles and check with permission', () => {
    beforeAll(async () => {
      // create role
      const res1 = await setRole(
        getPermissionInput({ roleName: 'Perm_from_A.1', permission: DENINED }),
        adminAToken
      )
      const res2 = await setRole(
        getPermissionInput({ roleName: 'Perm_from_A.2', permission: DENINED }),
        adminAToken
      )
      const res3 = await setRole(
        getPermissionInput({ roleName: 'Perm_from_A.3', permission: DENINED }),
        adminAToken
      )

      // role created by admin B
      const resB1 = await setRole(
        getPermissionInput({ roleName: 'Perm_from_B.1', permission: DENINED }),
        adminBToken,
        { ultimateAdminToken: adminToken }
      )
      const resB2 = await setRole(
        getPermissionInput({ roleName: 'Perm_from_B.2', permission: DENINED }),
        adminBToken,
        { ultimateAdminToken: adminToken }
      )
      const resB3 = await setRole(
        getPermissionInput({ roleName: 'Perm_from_B.3', permission: DENINED }),
        adminBToken,
        { ultimateAdminToken: adminToken }
      )

      permissionIdA.push(res1.id, res2.id, res3.id)
      permissionIdB.push(resB1.id, resB2.id, resB3.id)
    })

    it('User A can read all permissions', async () => {
      const perms = await getPermissions(adminAToken)
      const filteredPerms = perms.filter((p) => /Perm_from/.test(p.roleName))

      expect(filteredPerms.length).toBe(6)
    })

    it('user B can only list their own permissions', async () => {
      const perms = await getPermissions(adminBToken)
      const filteredPerms = perms.filter((p) => /Perm_from/.test(p.roleName))

      expect(filteredPerms.length).toBe(3)
    })

    it('user B can only list their own permissions with pagination', async () => {
      const perms = await getPermissions(adminBToken, { limit: 2, skip: 1 })
      const filteredPerms = perms.filter((p) => /Perm_from/.test(p.roleName))

      expect(filteredPerms.length).toBe(2)
      perms.forEach((p) => expect(permissionIdB.includes(p.id)).toBe(true))
    })

    it("User B can read its own permission but not user A's one", async () => {
      const readPermId = permissionIdB[0]
      const perm = await getPermById(adminBToken, readPermId)

      expect(perm.id).toBe(readPermId)

      const cannotReadPermId = permissionIdA[0]
      try {
        await getPermById(adminBToken, cannotReadPermId)
      } catch (error) {
        expect(getErrMessage(error)).toBe(
          "You don't have permission to do this action on resource"
        )
      }
    })

    it('UserA CAN update userB permission, but userB CAN NOT do it with userA', async () => {
      const updatingPermissionBId = permissionIdB[0]
      const updatingPermissionAId = permissionIdA[0]

      await setRole(
        getPermissionInput({
          roleName: 'Perm_from_B.1',
          blog: 'C:+|R:+|U:+|D:+',
        }),
        adminAToken,
        { id: updatingPermissionBId }
      )

      const result = await getPermById(adminAToken, updatingPermissionBId)
      expect(result.blog).toBe('C:+|R:+|U:+|D:+')

      try {
        await setRole(
          getPermissionInput({
            roleName: 'Perm_from_A.1',
            blog: 'C:+|R:+|U:+|D:+',
          }),
          adminBToken,
          { id: updatingPermissionAId }
        )
      } catch (error) {
        expect(getErrMessage(error)).toBe(
          "You don't have permission to do this action on resource"
        )
      }
    })

    it('UserA CAN delete userB permission, but userB CAN NOT do it with userA', async () => {
      const deletingPermIdB = permissionIdB.shift()
      const deletingPermIdA = permissionIdA[0]
      const result = await deletePermissons(deletingPermIdB, adminAToken)
      expect(result).toBe(true)

      try {
        await deletePermissons(deletingPermIdA, adminBToken)
      } catch (error) {
        expect(getErrMessage(error)).toBe(
          "You don't have permission to do this action on resource"
        )
      }
    })

    afterAll(() => {
      console.log('Perms teardown')
      permissionIdA.forEach(async (id) => deletePermissons(id, adminToken))
      permissionIdB.forEach(async (id) => deletePermissons(id, adminToken))
    })
  })
})
