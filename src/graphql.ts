
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class SignUpInput {
    email: string;
    name: string;
    password: string;
}

export class SignInInput {
    email: string;
    password: string;
}

export class PermissionSetInput {
    course: string;
    permission: string;
    user: string;
    blog: string;
    notification: string;
    instructor: string;
}

export class AdminUser {
    __typename?: 'AdminUser';
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    role: string;
    createBy?: AdminUser;
    createdAt: string;
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract heartBeat(): string | Promise<string>;

    abstract heartBeatWithAuth(): string | Promise<string>;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract AuthOperator(data: SignInInput): AuthMutation | Promise<AuthMutation>;

    abstract PermissionMutation(): PermissionMutation | Promise<PermissionMutation>;
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

export class Permission {
    __typename?: 'Permission';
    id: string;
    course: string;
    permission: string;
    user: string;
    blog: string;
    notification: string;
    instructor: string;
}

export class PermissionMutation {
    __typename?: 'PermissionMutation';
    setPermission?: Permission;
    deletePermission?: Permission;
}
