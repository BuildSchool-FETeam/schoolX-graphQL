
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
}

export class InstructorSetInput {
    name: string;
    title: string;
    description: string;
    email: string;
    ClientUserId?: string;
    image: FileUpload;
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

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract adminUserQuery(): AdminUserQuery | Promise<AdminUserQuery>;

    abstract heartBeat(): string | Promise<string>;

    abstract heartBeatWithAuth(): string | Promise<string>;

    abstract courseQuery(): CourseQuery | Promise<CourseQuery>;

    abstract permissionQuery(): PermissionQuery | Promise<PermissionQuery>;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract adminUserMutation(): AdminUserMutation | Promise<AdminUserMutation>;

    abstract authMutation(): AuthMutation | Promise<AuthMutation>;

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

export class AuthMutation {
    __typename?: 'AuthMutation';
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
    setCourse?: CourseType;
}

export class CourseType {
    __typename?: 'CourseType';
    title: string;
    description: string;
    instructor: InstructorType;
    benefits: string[];
    requirements: string[];
}

export class InstructorMutation {
    __typename?: 'InstructorMutation';
    setInstructor: InstructorType;
}

export class InstructorType {
    __typename?: 'InstructorType';
    id: string;
    name: string;
    title: string;
    description: string;
    email: string;
    imageUrl: string;
    phone: string;
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

export type FileUpload = any;
