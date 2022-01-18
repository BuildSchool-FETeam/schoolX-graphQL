import { Test } from "@nestjs/testing"
import { Assignment } from "src/assignment/entities/Assignment.entity"
import { AssignmentService } from "src/assignment/services/assignment.service"
import { AuthGuard } from "src/common/guards/auth.guard"
import { baseServiceMock } from "src/common/mock/baseServiceMock"
import { guardMock } from "src/common/mock/guardMock"
import { createAssignmentEntityMock, createCodeChallengeEntityMock, createCommentEntityMock, createFileAssignmentEntityMock, createLessonEntityMock, createQuizEntityMock } from "src/common/mock/mockEntity"
import { AssignmentTypeResolver } from "../assignmentType.resolver"

const assignmentServiceMock = {
    ...baseServiceMock
}

describe('AssignmentTypeResolver', () => {
    let resolver: AssignmentTypeResolver
    beforeAll(async () => {
        const testModule = Test.createTestingModule({
            providers: [AssignmentTypeResolver, AssignmentService]
        })

        testModule.overrideProvider(AssignmentService).useValue(assignmentServiceMock)
        testModule.overrideGuard(AuthGuard).useValue(guardMock)

        const compiledModule = await testModule.compile()

        resolver = compiledModule.get(AssignmentTypeResolver)
    })

    let assignmentMock: Assignment

    beforeEach(() => {
        assignmentMock = createAssignmentEntityMock({id: "1"})
    })

    afterEach(() => { jest.resetAllMocks() })

    describe('lesson', () => {
        it('should return lesson', async () => {
            assignmentMock.lesson = createLessonEntityMock({id: "2", title: "lesson 2"})
            jest.spyOn(assignmentServiceMock, 'findById').mockResolvedValue(assignmentMock)

            const result = await resolver.lesson(assignmentMock)

            expect(result).toEqual(createLessonEntityMock({id: "2", title: "lesson 2"}))
        })
    })

    describe('comments', () => {
        it('should return list of user comments', async () => {
            assignmentMock.comments = [
                createCommentEntityMock({id: "1", title: "comment 1"}),
                createCommentEntityMock({id: "2", title: "comment 2"})
            ]
            jest.spyOn(assignmentServiceMock, 'findById').mockResolvedValue(assignmentMock)

            const result = await resolver.comments(assignmentMock, {})

            expect(result).toEqual([
                createCommentEntityMock({id: "1", title: "comment 1"}),
                createCommentEntityMock({id: "2", title: "comment 2"})
            ])
        })
    })

    describe('codeChallenges', () => {
        it('should return list of codeChallenges', async () => {
            assignmentMock.codeChallenges = [
                createCodeChallengeEntityMock({id: "1", title: "code challenge 1"}),
                createCodeChallengeEntityMock({id: "2", title: "code challenge 2"})
            ]
            jest.spyOn(assignmentServiceMock, 'findById').mockResolvedValue(assignmentMock)

            const result = await resolver.codeChallenges(assignmentMock)
            
            expect(result).toEqual([
                createCodeChallengeEntityMock({id: "1", title: "code challenge 1"}),
                createCodeChallengeEntityMock({id: "2", title: "code challenge 2"})
            ])
        })
    })

    describe('quizs', () => {
        it('should return list of quizs', async () => {
            assignmentMock.quizs = [
                createQuizEntityMock({id: "1", title: "quiz 1"}),
                createQuizEntityMock({id: "2", title: "quiz 2"})
            ]
            jest.spyOn(assignmentServiceMock, 'findById').mockResolvedValue(assignmentMock)

            const result = await resolver.quizs(assignmentMock)
            
            expect(result).toEqual([
                createQuizEntityMock({id: "1", title: "quiz 1"}),
                createQuizEntityMock({id: "2", title: "quiz 2"})
            ])
        })
    })

    describe('fileAssignments', () => {
        it('should return list of codeChallenges', async () => {
            assignmentMock.fileAssignments = [
                createFileAssignmentEntityMock({id: "1", title: "file assignment 1"}),
                createFileAssignmentEntityMock({id: "2", title: "file assignment 2"})
            ]
            jest.spyOn(assignmentServiceMock, 'findById').mockResolvedValue(assignmentMock)

            const result = await resolver.fileAssignments(assignmentMock)
            
            expect(result).toEqual([
                createFileAssignmentEntityMock({id: "1", title: "file assignment 1"}),
                createFileAssignmentEntityMock({id: "2", title: "file assignment 2"})
            ])
        })
    })
})