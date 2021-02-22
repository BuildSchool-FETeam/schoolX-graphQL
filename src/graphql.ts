
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
    role: string;
}

export class SignInInput {
    email: string;
    password: string;
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract heartBeat(): string | Promise<string>;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract signUp(data: SignUpInput): AuthPayload | Promise<AuthPayload>;

    abstract signIn(data: SignInInput): AuthPayload | Promise<AuthPayload>;
}

export class AuthPayload {
    __typename?: 'AuthPayload';
    token: string;
    userName: string;
    role: string;
}

export class User {
    __typename?: 'User';
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    role: string;
    createBy?: User;
    createdAt: string;
}
