
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

    abstract adminUserQuery(): AdminUserQuery | Promise<AdminUserQuery>;

    abstract heartBeat(): string | Promise<string>;

    abstract heartBeatWithAuth(): string | Promise<string>;

    abstract courseQuery(): CourseQuery | Promise<CourseQuery>;

    abstract instructorQuery(): InstructorQuery | Promise<InstructorQuery>;

    abstract permissionQuery(): PermissionQuery | Promise<PermissionQuery>;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract adminUserMutation(): AdminUserMutation | Promise<AdminUserMutation>;

    abstract adminAuthMutation(): AdminAuthMutation | Promise<AdminAuthMutation>;

    abstract courseMutation(): CourseMutation | Promise<CourseMutation>;

    abstract instructorMutation(): InstructorMutation | Promise<InstructorMutation>;

    abstract permissionMutation(): PermissionMutation | Promise<PermissionMutation>;
}

export class AdminUserQuery {
    __typename?: 'AdminUserQuery';
    getAllAdminUsers?: AdminUser[];
    getAdminUserById: AdminUser;
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
    createBy?: AdminUser;
    createdAt: string;
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
    getAllCourses: CourseType[];
    getCourseById: CourseType;
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
}

export class InstructorQuery {
    __typename?: 'InstructorQuery';
    getAllInstructors: InstructorType[];
    getInstructorById: InstructorType;
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
    getAllPermissions?: Permission[];
    getPermissionById?: Permission;
    getPermissionByRole?: Permission;
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
