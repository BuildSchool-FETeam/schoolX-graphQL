
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum OrderDirection {
    ASC = "ASC",
    DESC = "DESC"
}

export class AdminUserSetInput {
    email: string;
    name: string;
    role: string;
    password?: string;
}

export class AssignmentSetInput {
    title: string;
    description: string;
    hints: string[];
    score: number;
    input: string;
    output: string;
    languageSupport: string[];
    lessonId: string;
}

export class TestCaseSetInput {
    title: string;
    input: string;
    expectedOutput: string;
    assignmentId: string;
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

export class ClientUserUpdateInput {
    name?: string;
    githubUrl?: string;
    dateOfBirth?: string;
    homeTown?: string;
    bio?: string;
    phone?: string;
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

export class OrderType {
    orderBy: string;
    direction: OrderDirection;
}

export class PaginationInput {
    order?: OrderType;
    skip?: number;
    limit?: number;
}

export class SearchOptionInput {
    searchString: string;
    searchFields: string[];
}

export class CourseSetInput {
    title: string;
    description: string;
    instructorId: string;
    benefits: string[];
    requirements: string[];
    image?: FileUpload;
    tags: string[];
    levels: string[];
}

export class LessonSetInput {
    title: string;
    videoUrl: string;
    courseId: string;
    content: string;
    documents?: FileUpload[];
}

export class AddDocumentInput {
    file: FileUpload;
}

export class InstructorSetInput {
    name: string;
    title: string;
    description: string;
    email: string;
    ClientUserId?: string;
    image?: FileUpload;
    phone: string;
}

export class NotificationInput {
    title: string;
    content: string;
    recipientByRoles?: string[];
    recipientByAdminIds?: string[];
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
    createdAt: string;
    updatedAt: string;
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract heartBeat(): string | Promise<string>;

    abstract heartBeatWithAuth(): string | Promise<string>;

    abstract adminUserQuery(): AdminUserQuery | Promise<AdminUserQuery>;

    abstract assignmentQuery(): AssignmentQuery | Promise<AssignmentQuery>;

    abstract testCaseQuery(): TestCaseQuery | Promise<TestCaseQuery>;

    abstract clientUserQuery(): ClientUserQuery | Promise<ClientUserQuery>;

    abstract courseQuery(): CourseQuery | Promise<CourseQuery>;

    abstract lessonQuery(): LessonQuery | Promise<LessonQuery>;

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

    abstract adminUserMutation(): AdminUserMutation | Promise<AdminUserMutation>;

    abstract assignmentMutation(): AssignmentMutation | Promise<AssignmentMutation>;

    abstract testCaseMutation(): TestCaseMutation | Promise<TestCaseMutation>;

    abstract adminAuthMutation(): AdminAuthMutation | Promise<AdminAuthMutation>;

    abstract clientUserAuthMutation(): ClientUserAuthMutation | Promise<ClientUserAuthMutation>;

    abstract clientUserMutation(): ClientUserMutation | Promise<ClientUserMutation>;

    abstract courseMutation(): CourseMutation | Promise<CourseMutation>;

    abstract lessonMutation(): LessonMutation | Promise<LessonMutation>;

    abstract documentMutation(): DocumentMutation | Promise<DocumentMutation>;

    abstract instructorMutation(): InstructorMutation | Promise<InstructorMutation>;

    abstract notificationMutation(): NotificationMutation | Promise<NotificationMutation>;

    abstract permissionMutation(): PermissionMutation | Promise<PermissionMutation>;
}

export class AdminUserQuery {
    __typename?: 'AdminUserQuery';
    adminUsers: AdminUser[];
    adminUser: AdminUser;
    totalAdminUsers: number;
}

export class AdminUserMutation {
    __typename?: 'AdminUserMutation';
    setAdminUser: AdminUser;
    deleteAdminUser?: boolean;
}

export class AdminUser {
    __typename?: 'AdminUser';
    id: string;
    email: string;
    name: string;
    role: string;
    createdBy?: AdminUser;
}

export class AssignmentType implements BaseGraphQL {
    __typename?: 'AssignmentType';
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    hints: string[];
    score: number;
    input: string;
    output: string;
    languageSupport: string[];
    lesson: LessonType;
    testCases: TestCaseType[];
}

export class AssignmentMutation {
    __typename?: 'AssignmentMutation';
    setAssignment: AssignmentType;
    deleteAssignment?: boolean;
}

export class AssignmentQuery {
    __typename?: 'AssignmentQuery';
    assignment: AssignmentType;
}

export class TestCaseType implements BaseGraphQL {
    __typename?: 'TestCaseType';
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    input: string;
    expectedOutput: string;
    assignment: AssignmentType;
}

export class TestCaseMutation {
    __typename?: 'TestCaseMutation';
    setTestCase: TestCaseType;
    deleteTestCase?: boolean;
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

export class ClientUserMutation {
    __typename?: 'ClientUserMutation';
    updateClientUser: ClientUserType;
    updateClientUserAvatar: ClientUserType;
}

export class ClientUserQuery {
    __typename?: 'ClientUserQuery';
    userDetail: ClientUserType;
}

export class ClientUserAuthResponse {
    __typename?: 'ClientUserAuthResponse';
    id: string;
    email: string;
    token: string;
}

export class ClientUserType {
    __typename?: 'ClientUserType';
    id: string;
    email?: string;
    password?: string;
    githubUrl?: string;
    dayOfBirth?: string;
    homeTown?: string;
    bio?: string;
    phone?: string;
    imageUrl?: string;
    filePath?: string;
    instructor?: InstructorType;
    achievement: AchievementType;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export class AchievementType {
    __typename?: 'AchievementType';
    id: string;
    rank?: number;
    score?: number;
    joinedCourse: CourseType[];
    follow: ClientUserType[];
    followedBy: ClientUserType[];
    completedCourses: CourseType[];
}

export class File {
    __typename?: 'File';
    filename: string;
    mimetype: string;
    encoding: string;
}

export class CourseQuery {
    __typename?: 'CourseQuery';
    courses: CourseType[];
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
    createdAt: string;
    updatedAt: string;
    description: string;
    instructor: InstructorType;
    benefits: string[];
    requirements: string[];
    imageUrl?: string;
    tags: TagType[];
    lessons: LessonType[];
    createdBy?: AdminUser;
    levels: string[];
}

export class LessonType implements BaseGraphQL {
    __typename?: 'LessonType';
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    videoUrl: string;
    votes: number;
    course: CourseType;
    content: string;
    documents: DocumentType[];
    assignments: AssignmentType[];
}

export class LessonMutation {
    __typename?: 'LessonMutation';
    setLesson: LessonType;
    deleteLesson: boolean;
}

export class LessonQuery {
    __typename?: 'LessonQuery';
    lesson: LessonType;
    lessonsWithCourseId: LessonType[];
    totalLessons: number;
}

export class DocumentType implements BaseGraphQL {
    __typename?: 'DocumentType';
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
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
    deleteInstructor?: boolean;
}

export class InstructorType implements BaseGraphQL {
    __typename?: 'InstructorType';
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    description: string;
    email: string;
    imageUrl: string;
    phone: string;
    courses: CourseType[];
    createdBy?: AdminUser;
}

export class NotificationMutation {
    __typename?: 'NotificationMutation';
    createNotification?: NotificationType;
    deleteByOwner: boolean;
    deleteByRecipient: boolean;
}

export class NotificationQuery {
    __typename?: 'NotificationQuery';
    notificationsReceived: NotificationType[];
    notificationsSent: NotificationType[];
    notification: NotificationType;
    totalNotificationReceived: number;
    totalNotificationSent: number;
}

export class NotificationType implements BaseGraphQL {
    __typename?: 'NotificationType';
    id: string;
    title: string;
    content: string;
    createdAt: string;
    createdBy?: AdminUser;
    updatedAt: string;
    recipientByAdmins?: AdminUser[];
}

export class PermissionMutation {
    __typename?: 'PermissionMutation';
    setPermission: Permission;
    deletePermission: boolean;
}

export class PermissionQuery {
    __typename?: 'PermissionQuery';
    permissions?: Permission[];
    permissionWithId?: Permission;
    permissionWithRole?: Permission;
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
    createdBy?: AdminUser;
}

export class TagType implements BaseGraphQL {
    __typename?: 'TagType';
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    courses: CourseType[];
}

export type FileUpload = any;
