import { Test } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { CodeChallenge } from "src/assignment/entities/codeChallenge/CodeChallenge.entity"
import { createAssignmentEntityMock, createCodeChallengeEntityMock, createLessonEntityMock } from "src/common/mock/mockEntity"
import { repositoryMockFactory } from "src/common/mock/repositoryMock"
import { Lesson } from "src/courses/entities/Lesson.entity"
import { LessonService } from "src/courses/services/lesson.service"
import { CodeChallengeSetInput } from "src/graphql"
import { JavaMiniServerService } from "src/mini-server/services/JavaMiniServer.service"
import { JSMiniServerService } from "src/mini-server/services/JSMiniServer.service"
import { PythonMiniServerService } from "src/mini-server/services/PythonMiniServer.service"
import { Code, Repository } from "typeorm"
import { AssignmentService } from "../../assignment.service"
import { CodeChallengeService } from "../../codeChallenge/codeChallenge.service"

const GServiceMock = {
    async findById() {
        return Promise.resolve({})
    },
}
const lessonServiceMock = {
    ...GServiceMock
}
const jsMiniServiceMock = {}
const pythonMiniServiceMock = {}
const javaMiniServiceMock = {}
const assignmentServiceMock = {
    ...GServiceMock,
    async createAssignment () {
        return Promise.resolve({})
    }
}
describe('CodeChallengeService', () => {
    let codeChallengeRepo: Repository<CodeChallenge>
    let codeChallengeService: CodeChallengeService
    beforeAll(async () => {
        const testModule = Test.createTestingModule({
            providers: [
                CodeChallengeService,
                JSMiniServerService,
                JavaMiniServerService,
                PythonMiniServerService,
                AssignmentService,
                LessonService,
                {
                    provide: getRepositoryToken(CodeChallenge),
                    useFactory: repositoryMockFactory
                }
            ]
        })

        testModule.overrideProvider(LessonService).useValue(lessonServiceMock);
        testModule.overrideProvider(AssignmentService).useValue(assignmentServiceMock);
        testModule.overrideProvider(JSMiniServerService).useValue(jsMiniServiceMock);
        testModule.overrideProvider(PythonMiniServerService).useValue(pythonMiniServiceMock);
        testModule.overrideProvider(JavaMiniServerService).useValue(javaMiniServiceMock);

        const compliedModule = await testModule.compile();
        codeChallengeService = compliedModule.get(CodeChallengeService);
        codeChallengeRepo = compliedModule.get(getRepositoryToken(CodeChallenge))
    })

    const codeChallengeSetInput: CodeChallengeSetInput = {
        title: "new Code Challenge",
        description: "description",
        lessonId: "lessonId",
        input: "10",
        output: "100",
        hints: [],
        score: 100,
        languageSupport: []
    }

    describe("create", () => {
        let lesson: Lesson

        beforeEach(() => { lesson = createLessonEntityMock() })
        afterEach(() => { jest.resetAllMocks() })

        it("If assignment didn't exist, should create new assignment then create code Challenge", async () => {
            lesson.assignment = undefined;

            jest.spyOn(lessonServiceMock, 'findById').mockResolvedValue(lesson);

            const createAssignment = jest
            .spyOn(assignmentServiceMock, 'createAssignment')
            .mockResolvedValue(createAssignmentEntityMock({id: "2", title: "new Assignment", lesson}));

            jest
                .spyOn(codeChallengeRepo, 'save')
                .mockImplementation(async (data) => createCodeChallengeEntityMock({...data, id: "2"} as CodeChallenge))
            const result = await codeChallengeService.create(codeChallengeSetInput);
            console.log(result)

            expect(result).toEqual(createCodeChallengeEntityMock({
                    id: "2",
                    languageSupport: codeChallengeSetInput.languageSupport.join("|"),
                    hints: codeChallengeSetInput.hints.join("|"),
                    assignment: createAssignmentEntityMock({ id: "2", title: "new Assignment" }),
                    title: codeChallengeSetInput.title,
                    description: codeChallengeSetInput.description,
                }))
            expect(createAssignment).toHaveBeenCalledTimes(1);
        })
    })
})