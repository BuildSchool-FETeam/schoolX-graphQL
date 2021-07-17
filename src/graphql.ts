
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum ArticleStatus {
    pending = "pending",
    accept = "accept",
    reject = "reject"
}

export enum ProgrammingLanguage {
    javascript = "javascript",
    python = "python",
    CSharp = "CSharp",
    java = "java"
}

export enum OrderDirection {
    ASC = "ASC",
    DESC = "DESC"
}

export class AdminUserSetInput {
    email: string;
    name: string;
    role: string;
    password?: Nullable<string>;
}

export class ArticleReviewInput {
    comment?: Nullable<string>;
    status?: Nullable<ArticleStatus>;
}

export class FilterArticleInput {
    byTag?: Nullable<Nullable<string>[]>;
    byDate?: Nullable<CompareInputDate>;
    byStatus?: Nullable<CompareInputString>;
}

export class ArticleInputType {
    title: string;
    shortDescription: string;
    content: string;
    tags: string[];
}

export class AssignmentSetInput {
    title: string;
    description: string;
    hints: Nullable<string>[];
    score: number;
    input: string;
    output: string;
    languageSupport: Nullable<string>[];
    lessonId: string;
}

export class CodeConfigInput {
    code: string;
    language: ProgrammingLanguage;
}

export class TestCaseSetInput {
    title: string;
    runningTestScript: string;
    expectResult?: Nullable<string>;
    assignmentId: string;
    generatedExpectResultScript?: Nullable<string>;
    programingLanguage: ProgrammingLanguage;
    timeEvaluation?: Nullable<number>;
}

export class SignUpInput {
    email: string;
    name: string;
    password: string;
}

export class SignInInput {
    email: string;
    password: string;
}

export class ClientUserSignupInput {
    name: string;
    email: string;
    password: string;
}

export class ClientUserSigninInput {
    email: string;
    password: string;
}

export class ClientUserUpdateInput {
    name?: Nullable<string>;
    githubUrl?: Nullable<string>;
    dayOfBirth?: Nullable<ScalarDate>;
    homeTown?: Nullable<string>;
    bio?: Nullable<string>;
    phone?: Nullable<string>;
}

export class CommentDataInput {
    id?: Nullable<string>;
    title: string;
    content: string;
}

export class OrderType {
    orderBy: string;
    direction: OrderDirection;
}

export class PaginationInput {
    order?: Nullable<OrderType>;
    skip?: Nullable<number>;
    limit?: Nullable<number>;
}

export class SearchOptionInput {
    searchString: string;
    searchFields: string[];
}

export class CompareInputDate {
    lt?: Nullable<ScalarDate>;
    gt?: Nullable<ScalarDate>;
    eq?: Nullable<ScalarDate>;
    ne?: Nullable<ScalarDate>;
}

export class CompareInputString {
    ct?: Nullable<string>;
    eq?: Nullable<string>;
    nc?: Nullable<string>;
    ne?: Nullable<string>;
}

export class CourseSetInput {
    title: string;
    description: string;
    instructorId: string;
    benefits: string[];
    requirements: string[];
    image?: Nullable<FileUpload>;
    tags: string[];
    levels: Nullable<string>[];
}

export class LessonSetInput {
    title: string;
    videoUrl: string;
    courseId: string;
    content: string;
    documents?: Nullable<Nullable<FileUpload>[]>;
}

export class AddDocumentInput {
    file: FileUpload;
}

export class InstructorSetInput {
    name: string;
    title: string;
    description: string;
    email: string;
    ClientUserId?: Nullable<string>;
    image?: Nullable<FileUpload>;
    phone: string;
}

export class NotificationInput {
    title: string;
    content: string;
    recipientByRoles?: Nullable<Nullable<string>[]>;
    recipientByAdminIds?: Nullable<Nullable<string>[]>;
}

export class PermissionSetInput {
    roleName: string;
    course: string;
    permission: string;
    user: string;
    blog: string;
    notification: string;
    instructor: string;
}

export interface BaseGraphQL {
    id: string;
    title: string;
    createdAt: ScalarDate;
    updatedAt: ScalarDate;
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract heartBeat(): string | Promise<string>;

    abstract heartBeatWithAuth(): string | Promise<string>;

    abstract adminUserQuery(): Nullable<AdminUserQuery> | Promise<Nullable<AdminUserQuery>>;

    abstract articleQuery(): ArticleQuery | Promise<ArticleQuery>;

    abstract assignmentQuery(): AssignmentQuery | Promise<AssignmentQuery>;

    abstract testCaseQuery(): TestCaseQuery | Promise<TestCaseQuery>;

    abstract clientUserQuery(): Nullable<ClientUserQuery> | Promise<Nullable<ClientUserQuery>>;

    abstract courseQuery(): Nullable<CourseQuery> | Promise<Nullable<CourseQuery>>;

    abstract lessonQuery(): Nullable<LessonQuery> | Promise<Nullable<LessonQuery>>;

    abstract instructorQuery(): InstructorQuery | Promise<InstructorQuery>;

    abstract notificationQuery(): NotificationQuery | Promise<NotificationQuery>;

    abstract permissionQuery(): PermissionQuery | Promise<PermissionQuery>;
}

export abstract class ISubscription {
    __typename?: 'ISubscription';

    abstract beatCount(divideNumber: number): number | Promise<number>;

    abstract notificationCreated(adminUserId: string): NotificationType | Promise<NotificationType>;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract adminUserMutation(): Nullable<AdminUserMutation> | Promise<Nullable<AdminUserMutation>>;

    abstract articleMutation(): ArticleMutation | Promise<ArticleMutation>;

    abstract assignmentMutation(): AssignmentMutation | Promise<AssignmentMutation>;

    abstract testCaseMutation(): TestCaseMutation | Promise<TestCaseMutation>;

    abstract adminAuthMutation(): AdminAuthMutation | Promise<AdminAuthMutation>;

    abstract clientUserAuthMutation(): ClientUserAuthMutation | Promise<ClientUserAuthMutation>;

    abstract clientUserMutation(): ClientUserMutation | Promise<ClientUserMutation>;

    abstract userCommentMutation(): UserCommentMutation | Promise<UserCommentMutation>;

    abstract courseMutation(): CourseMutation | Promise<CourseMutation>;

    abstract lessonMutation(): LessonMutation | Promise<LessonMutation>;

    abstract documentMutation(): Nullable<DocumentMutation> | Promise<Nullable<DocumentMutation>>;

    abstract instructorMutation(): InstructorMutation | Promise<InstructorMutation>;

    abstract notificationMutation(): NotificationMutation | Promise<NotificationMutation>;

    abstract permissionMutation(): Nullable<PermissionMutation> | Promise<Nullable<PermissionMutation>>;
}

export class AdminUserQuery {
    __typename?: 'AdminUserQuery';
    adminUsers: Nullable<AdminUser>[];
    adminUser: AdminUser;
    totalAdminUsers: number;
}

export class AdminUserMutation {
    __typename?: 'AdminUserMutation';
    setAdminUser: AdminUser;
    deleteAdminUser?: Nullable<boolean>;
}

export class AdminUser {
    __typename?: 'AdminUser';
    id: string;
    email: string;
    name: string;
    role: string;
    createdBy?: Nullable<AdminUser>;
}

export class ArticleQuery {
    __typename?: 'ArticleQuery';
    articles: Nullable<ArticleType>[];
    filteredArticles: Nullable<ArticleType>[];
    articleDetail?: Nullable<ArticleType>;
    tags: Nullable<ArticleTagType>[];
}

export class ArticleMutation {
    __typename?: 'ArticleMutation';
    setArticle: ArticleType;
    deleteArticle: boolean;
    reviewArticle: ArticleType;
}

export class ArticleType implements BaseGraphQL {
    __typename?: 'ArticleType';
    id: string;
    title: string;
    createdAt: ScalarDate;
    updatedAt: ScalarDate;
    shortDescription?: Nullable<string>;
    content?: Nullable<string>;
    votes: number;
    status: ArticleStatus;
    createdBy?: Nullable<ClientUserType>;
    views: number;
    shares: number;
    tags?: Nullable<Nullable<ArticleTagType>[]>;
    reviewComment?: Nullable<string>;
    comments: Nullable<UserCommentType>[];
}

export class ArticleTagType implements BaseGraphQL {
    __typename?: 'ArticleTagType';
    id: string;
    title: string;
    createdAt: ScalarDate;
    updatedAt: ScalarDate;
    articles?: Nullable<Nullable<ArticleType>[]>;
}

export class AssignmentType implements BaseGraphQL {
    __typename?: 'AssignmentType';
    id: string;
    title: string;
    createdAt: ScalarDate;
    updatedAt: ScalarDate;
    description: string;
    hints: Nullable<string>[];
    score: number;
    input: string;
    output: string;
    languageSupport: Nullable<string>[];
    lesson: LessonType;
    testCases: TestCaseType[];
    comments: Nullable<UserCommentType>[];
}

export class AssignmentMutation {
    __typename?: 'AssignmentMutation';
    setAssignment: AssignmentType;
    deleteAssignment?: Nullable<boolean>;
    runCode: CodeRunResultType;
    runTestCase: SummaryEvaluationResult;
}

export class SummaryEvaluationResult {
    __typename?: 'SummaryEvaluationResult';
    summaryEvaluation: boolean;
    testCaseEvaluations: Nullable<EvaluationResult>[];
}

export class EvaluationResult {
    __typename?: 'EvaluationResult';
    testResult: boolean;
    testCaseId: string;
    title: string;
    executeTime?: Nullable<number>;
    message?: Nullable<Nullable<string>[]>;
}

export class AssignmentQuery {
    __typename?: 'AssignmentQuery';
    assignment: AssignmentType;
}

export class CodeRunResultType {
    __typename?: 'CodeRunResultType';
    executeTime?: Nullable<number>;
    result?: Nullable<Nullable<string>[]>;
    status?: Nullable<string>;
}

export class TestCaseType implements BaseGraphQL {
    __typename?: 'TestCaseType';
    id: string;
    title: string;
    createdAt: ScalarDate;
    updatedAt: ScalarDate;
    runningTestScript: string;
    generatedExpectResultScript?: Nullable<string>;
    expectResult?: Nullable<string>;
    assignment: AssignmentType;
    programingLanguage: string;
    timeEvaluation?: Nullable<number>;
}

export class TestCaseMutation {
    __typename?: 'TestCaseMutation';
    setTestCase: TestCaseType;
    deleteTestCase?: Nullable<boolean>;
}

export class TestCaseQuery {
    __typename?: 'TestCaseQuery';
    testCase: TestCaseType;
}

export class AdminAuthMutation {
    __typename?: 'AdminAuthMutation';
    signUp: AuthPayload;
    signIn: AuthPayload;
}

export class AuthPayload {
    __typename?: 'AuthPayload';
    token: string;
    userName: string;
    role: string;
}

export class ClientUserAuthMutation {
    __typename?: 'ClientUserAuthMutation';
    signUp: ClientUserAuthResponse;
    signIn: ClientUserAuthResponse;
    activateAccount: boolean;
    sendRestorePassword: boolean;
    resetPassword: boolean;
}

export class ClientUserAuthResponse {
    __typename?: 'ClientUserAuthResponse';
    id: string;
    email: string;
    token?: Nullable<string>;
}

export class ClientUserMutation {
    __typename?: 'ClientUserMutation';
    updateClientUser: ClientUserType;
    updateClientUserAvatar: ClientUserType;
}

export class ClientUserQuery {
    __typename?: 'ClientUserQuery';
    userDetail: ClientUserType;
}

export class ClientUserType {
    __typename?: 'ClientUserType';
    id: string;
    email?: Nullable<string>;
    password?: Nullable<string>;
    githubUrl?: Nullable<string>;
    dayOfBirth?: Nullable<ScalarDate>;
    homeTown?: Nullable<string>;
    bio?: Nullable<string>;
    phone?: Nullable<string>;
    imageUrl?: Nullable<string>;
    filePath?: Nullable<string>;
    instructor?: Nullable<InstructorType>;
    achievement: AchievementType;
    name: string;
    createdAt: ScalarDate;
    updatedAt: ScalarDate;
    comments: Nullable<UserCommentType>[];
}

export class AchievementType {
    __typename?: 'AchievementType';
    id: string;
    rank?: Nullable<number>;
    score?: Nullable<number>;
    joinedCourse: Nullable<CourseType>[];
    follow: Nullable<ClientUserType>[];
    followedBy: Nullable<ClientUserType>[];
    completedCourses: Nullable<CourseType>[];
}

export class UserCommentMutation {
    __typename?: 'UserCommentMutation';
    setCommentToCourse: UserCommentType;
    setCommentToLesson: UserCommentType;
    setCommentToAssignment: UserCommentType;
    setCommentToArticle: UserCommentType;
    setReplyComment: UserCommentType;
    deleteComment: boolean;
}

export class UserCommentType implements BaseGraphQL {
    __typename?: 'UserCommentType';
    id: string;
    title: string;
    content: string;
    createdAt: ScalarDate;
    updatedAt: ScalarDate;
    createdBy: ClientUserType;
    replyComments: Nullable<UserCommentType>[];
    course?: Nullable<CourseType>;
    lesson?: Nullable<LessonType>;
    assignment?: Nullable<AssignmentType>;
    article?: Nullable<ArticleType>;
}

export class File {
    __typename?: 'File';
    filename: string;
    mimetype: string;
    encoding: string;
}

export class CourseQuery {
    __typename?: 'CourseQuery';
    courses: Nullable<CourseType>[];
    course: CourseType;
    totalCourses: number;
}

export class CourseMutation {
    __typename?: 'CourseMutation';
    setCourse: CourseType;
    deleteCourse: boolean;
}

export class CourseType implements BaseGraphQL {
    __typename?: 'CourseType';
    id: string;
    title: string;
    createdAt: ScalarDate;
    updatedAt: ScalarDate;
    description: string;
    instructor: InstructorType;
    benefits: string[];
    requirements: string[];
    imageUrl?: Nullable<string>;
    tags: TagType[];
    lessons: Nullable<LessonType>[];
    createdBy?: Nullable<AdminUser>;
    levels: Nullable<string>[];
    comments: Nullable<UserCommentType>[];
}

export class LessonType implements BaseGraphQL {
    __typename?: 'LessonType';
    id: string;
    title: string;
    createdAt: ScalarDate;
    updatedAt: ScalarDate;
    videoUrl: string;
    votes: number;
    course: CourseType;
    content: string;
    documents: Nullable<DocumentType>[];
    assignments: Nullable<AssignmentType>[];
    comments: Nullable<UserCommentType>[];
}

export class LessonMutation {
    __typename?: 'LessonMutation';
    setLesson: LessonType;
    deleteLesson: boolean;
}

export class LessonQuery {
    __typename?: 'LessonQuery';
    lesson: LessonType;
    lessonsWithCourseId: Nullable<LessonType>[];
    totalLessons: number;
}

export class DocumentType implements BaseGraphQL {
    __typename?: 'DocumentType';
    id: string;
    title: string;
    createdAt: ScalarDate;
    updatedAt: ScalarDate;
    url: string;
    lesson: LessonType;
}

export class DocumentMutation {
    __typename?: 'DocumentMutation';
    addDocumentToLesson: DocumentType;
    removeDocumentFromLesson: boolean;
}

export class InstructorQuery {
    __typename?: 'InstructorQuery';
    instructors: InstructorType[];
    instructor: InstructorType;
    totalInstructors: number;
}

export class InstructorMutation {
    __typename?: 'InstructorMutation';
    setInstructor: InstructorType;
    deleteInstructor?: Nullable<boolean>;
}

export class InstructorType implements BaseGraphQL {
    __typename?: 'InstructorType';
    id: string;
    title: string;
    createdAt: ScalarDate;
    updatedAt: ScalarDate;
    name: string;
    description: string;
    email: string;
    clientUser?: Nullable<ClientUserType>;
    imageUrl: string;
    phone: string;
    courses: Nullable<CourseType>[];
    createdBy?: Nullable<AdminUser>;
}

export class NotificationMutation {
    __typename?: 'NotificationMutation';
    createNotification?: Nullable<NotificationType>;
    deleteByOwner: boolean;
    deleteByRecipient: boolean;
}

export class NotificationQuery {
    __typename?: 'NotificationQuery';
    notificationsReceived: Nullable<NotificationType>[];
    notificationsSent: Nullable<NotificationType>[];
    notification: NotificationType;
    totalNotificationReceived: number;
    totalNotificationSent: number;
}

export class NotificationType implements BaseGraphQL {
    __typename?: 'NotificationType';
    id: string;
    title: string;
    content: string;
    createdAt: ScalarDate;
    createdBy?: Nullable<AdminUser>;
    updatedAt: ScalarDate;
    recipientByAdmins?: Nullable<Nullable<AdminUser>[]>;
}

export class PermissionMutation {
    __typename?: 'PermissionMutation';
    setPermission: Permission;
    deletePermission: boolean;
}

export class PermissionQuery {
    __typename?: 'PermissionQuery';
    permissions?: Nullable<Nullable<Permission>[]>;
    permissionWithId?: Nullable<Permission>;
    permissionWithRole?: Nullable<Permission>;
    totalPermissions: number;
}

export class Permission {
    __typename?: 'Permission';
    roleName: string;
    id: string;
    course: string;
    permission: string;
    user: string;
    blog: string;
    notification: string;
    instructor: string;
    createdBy?: Nullable<AdminUser>;
}

export class TagType implements BaseGraphQL {
    __typename?: 'TagType';
    id: string;
    title: string;
    createdAt: ScalarDate;
    updatedAt: ScalarDate;
    courses: Nullable<CourseType>[];
}

export type FileUpload = any;
export type ScalarDate = any;
type Nullable<T> = T | null;
