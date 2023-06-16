
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateUserInput {
    email: string;
    name?: Nullable<string>;
    age?: Nullable<number>;
}

export interface UpdateUserInput {
    id: string;
    email?: Nullable<string>;
    name?: Nullable<string>;
    age?: Nullable<number>;
}

export interface User {
    id: string;
    email?: Nullable<string>;
    name?: Nullable<string>;
    age?: Nullable<number>;
}

export interface IQuery {
    users(): Nullable<User>[] | Promise<Nullable<User>[]>;
    user(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export interface IMutation {
    createUser(createUserInput: CreateUserInput): User | Promise<User>;
    updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;
    removeUser(id: string): Nullable<boolean> | Promise<Nullable<boolean>>;
}

type Nullable<T> = T | null;
