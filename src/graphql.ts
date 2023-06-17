
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateProductInput {
    exampleField?: Nullable<number>;
}

export interface UpdateProductInput {
    id: number;
}

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

export interface Product {
    exampleField?: Nullable<number>;
}

export interface IQuery {
    products(): Nullable<Product>[] | Promise<Nullable<Product>[]>;
    product(id: number): Nullable<Product> | Promise<Nullable<Product>>;
    users(): Nullable<User>[] | Promise<Nullable<User>[]>;
    user(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export interface IMutation {
    createProduct(createProductInput: CreateProductInput): Product | Promise<Product>;
    updateProduct(updateProductInput: UpdateProductInput): Product | Promise<Product>;
    removeProduct(id: number): Nullable<Product> | Promise<Nullable<Product>>;
    createUser(createUserInput: CreateUserInput): User | Promise<User>;
    updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;
    removeUser(id: string): Nullable<string> | Promise<Nullable<string>>;
}

export interface User {
    id: string;
    email?: Nullable<string>;
    name?: Nullable<string>;
    age?: Nullable<number>;
}

type Nullable<T> = T | null;
