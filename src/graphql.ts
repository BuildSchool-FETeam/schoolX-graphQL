
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
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

export class CourseSetInput {
    title: string;
    description: string;
    instructorId: string;
    benefits: string[];
    requirements: string[];
    image?: FileUpload;
    tags: string[];
}

export class LessonSetInput {
    title: string;
    videoUrl: string;
    courseId: string;
    content: string;
}

export class AddDocumentInput {
    title: string;
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

    abstract courseQuery(): CourseQuery | Promise<CourseQuery>;

    abstract lessonQuery(): LessonQuery | Promise<LessonQuery>;

    abstract instructorQuery(): InstructorQuery | Promise<InstructorQuery>;

    abstract permissionQuery(): PermissionQuery | Promise<PermissionQuery>;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract adminUserMutation(): AdminUserMutation | Promise<AdminUserMutation>;

    abstract assignmentMutation(): AssignmentMutation | Promise<AssignmentMutation>;

    abstract testCaseMutation(): TestCaseMutation | Promise<TestCaseMutation>;

    abstract adminAuthMutation(): AdminAuthMutation | Promise<AdminAuthMutation>;

    abstract courseMutation(): CourseMutation | Promise<CourseMutation>;

    abstract lessonMutation(): LessonMutation | Promise<LessonMutation>;

    abstract documentMutation(): DocumentMutation | Promise<DocumentMutation>;

    abstract instructorMutation(): InstructorMutation | Promise<InstructorMutation>;

    abstract permissionMutation(): PermissionMutation | Promise<PermissionMutation>;
}

export class AdminUserQuery {
    __typename?: 'AdminUserQuery';
    adminUsers: AdminUser[];
    adminUser: AdminUser;
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
