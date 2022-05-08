import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AdminUserService } from "src/adminUser/services/AdminUser.service";
import { assertThrowError } from "src/common/mock/customAssertion";
import { createClientUserEntityMock, createRoleEntityMock } from "src/common/mock/mockEntity";
import { PasswordService } from "src/common/services/password.service";
import { TokenService } from "src/common/services/token.service";
import { SignUpInput } from "src/graphql";
import { AuthResolver } from "../auth.resolver"

const adminUserServiceMock = {
  async createUserBySignup() {
    return Promise.resolve({})
  },

  async findUserByEmail() {
    return Promise.resolve({})
  }
}
const tokenServiceMock = {
  createToken () {
    return ""
  }
}
const passwordServiecMock = {
  compare(dataPassword: string, userPassword: string) {
    return dataPassword === userPassword;
  }
}

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  const data: SignUpInput = {
    email: "email",
    name: "name",
    password: "password"
  }
  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [
        AuthResolver,
        AdminUserService,
        TokenService,
        PasswordService
      ]
    })

    setupTestModule.overrideProvider(AdminUserService).useValue(adminUserServiceMock)
    setupTestModule.overrideProvider(TokenService).useValue(tokenServiceMock)
    setupTestModule.overrideProvider(PasswordService).useValue(passwordServiecMock)

    const compliedModule = await setupTestModule.compile()

    resolver = compliedModule.get(AuthResolver)
  })

  describe("adminAuthMutatuion", () => {
    it("It should return empty object", async () => {
      expect(resolver.adminAuthMutation()).toEqual({})
    })
  })

  describe("signUp", () => {
    it("It should return token, userName, role", async () => {
      jest
        .spyOn(adminUserServiceMock ,"createUserBySignup")
        .mockResolvedValue(createClientUserEntityMock({
          name: "userName", role: createRoleEntityMock({name: "role"})
        }))
      jest.spyOn(tokenServiceMock, "createToken").mockReturnValue("token")

      const result = await resolver.signUp(data)

      expect(result).toEqual({
        token: "token",
        userName: "userName",
        role: "role"
      })
    })
  })

  describe("signIn", () => {
    it("It should throw Not found Exception if user doesn't exist", async () => {
      jest.spyOn(adminUserServiceMock, "findUserByEmail").mockResolvedValue(null);

      assertThrowError(
        resolver.signIn.bind(
          resolver,
          data
        ),
        new NotFoundException("User is not existed")
      )
    })

    it("It should throw Exception if password is invalid", async () => {
      jest
        .spyOn(adminUserServiceMock ,"findUserByEmail")
        .mockResolvedValue(createClientUserEntityMock({
          name: "userName",
          password: "password 1"
        }))

      assertThrowError(
        resolver.signIn.bind(
          resolver,
          data
        ),
        new BadRequestException("Invalid password")
      )
    })

    it("It should return token, userName, role", async () => {
      jest
        .spyOn(adminUserServiceMock ,"findUserByEmail")
        .mockResolvedValue(createClientUserEntityMock({
          name: "userName", 
          role: createRoleEntityMock({name: "role"}),
          password: "password"
        }))
      
        jest.spyOn(tokenServiceMock, "createToken").mockReturnValue("token")

        const result = await resolver.signIn(data)
  
        expect(result).toEqual({
          token: "token",
          userName: "userName",
          role: "role"
        })
    })
  })
})
