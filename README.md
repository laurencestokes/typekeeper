<div align="center">
    <h1>🛡️TypeKeeper</h1>
</div>

<p align="center">
    A lightweight type checking module for Typescript with typegaurds for common use cases which can be extended to handle niche cases
</p>

<br/>

<p align="center">
    <a href="https://github.com/LaurenceStokes/typekeeper/actions/workflows/validate.yml" target="_blank">
        <img src="https://github.com/LaurenceStokes/typekeeper/actions/workflows/validate.yml/badge.svg" alt="CI pipeline badge" />
    </a>
    <a href="https://www.npmjs.com/package/typekeeper" target="_blank">
        <img src="https://img.shields.io/npm/v/typekeeper.svg" alt="npmjs typekeeper" />
    </a>
</p>

# What is this?

This is a small, lightweight type checking library that also satisfies the TS compiler with typegaurds. It can be extended to have composite typegaurds, to check if something is an array of numbers for example, or an array of array of numbers (or, indeed, whatever!) at the type level.

The inspiration for this came from viewing this [tweet](https://twitter.com/toddmotto/status/1635423335742881792) from [Todd Motto](https://twitter.com/toddmotto). It piqued my interest and I decided to look into it deeper and convert it to Typescript. Unfortunately, as it is, that implementation is not typesafe at the typescript level (which is to be expected!). However, what this means is that if you were to use that code to check for example `isArray` on `const variable: unknown = []`, and then try to do `variable.map` typescript would still complain even inside an if check using the `isArray` you've written. This library combines the two approaches - you get the runtime type checking and the compile type safety/IDE autocomplete from typescript. I then went a step further and for the case of arrays/objects, made it so you could construct composite type gaurds, to check if something is an array of numbers for example, or an array of array of numbers, or an array of objects of signature xyz (or, indeed, whatever you can come up with/be bothered to write a custom typegaurd callback for!).

<br />

## Quick Example:
<br />

```ts
import typeKeeper from './typekeeper';

const myArray: unknown = [1, 2, 3];
// As expected, TS will complain as myArray is 'unknown'.
myArray.map(x => x * 2)

if (typeKeeper.isArray(myArray)) {
  // TypeScript knows that myArray is an array here, but doesn't know the type of x
  // so it's 'any', but TS won't complain
  console.log(myArray.map(x => x * 2));
}

if (typeKeeper.isArray(myArray, typeKeeper.isNumber)) {
  // TypeScript knows that myArray is an array of numbers here as we've passed a second check to isArray which ensures
  // every element in the array passes the type predicate for isNumber
  console.log(myArray.map(x => x * 2));
}

const myArrayOfArrays: unknown = [[1], [2], [3]];
// Custom nested type predicate callback we can pass through to isArray
const isNumberArray = (arg: any): arg is number[] => typeKeeper.isArray(arg, typeKeeper.isNumber);

if (typeKeeper.isArray(myArrayOfArrays, isNumberArray)) {
  // TypeScript knows that myArray is an array of array of numbers here
  // It knows 'x' is of type array, with each element being a number, and so knows y is a number
  console.log(myArrayOfArrays.map((x) => x.map(y => y * 2)));
}
```
<br />

# Table of Contents

1. [Quick start guide](#id-section1)
    1. [Installing](#id-section1-1)
    2. [Importing](#id-section1-2)
    3. [Usage](#id-section1-3)
2. [Contributing Code](#id-section2)
    1. [How to contribute summary](#id-section2-1)
    2. [Version Bumping](#id-section2-2)
3. [Testing](#id-section3)
4. [Changelog](#id-section4)

<br />
<br />

<div id='id-section1'></div>

## 🚀 Quick start guide

<hr />

<div id='id-section1-1'></div>

## Installing

```

npm i typekeeper
yarn add typekeeper

```

<div id='id-section1-2'></div>

## Importing

```ts
import { typeKeeper } from 'typekeeper';
```

<div id='id-section1-3'></div>

## Usage

<hr />

```ts
import typeKeeper from './typekeeper';

const myArray: unknown = [1, 2, 3];

// As expected, TS will complain as myArray is 'unknown'.
myArray.map(x => x * 2)

if (typeKeeper.isArray(myArray)) {
  // TypeScript knows that myArray is an array here, but doesn't know the type of x
  // so it's 'any', but this won't complain
  console.log(myArray.map(x => x * 2));
}

if (typeKeeper.isArray(myArray, typeKeeper.isNumber)) {
  // TypeScript knows that myArray is an array of numbers here as we've passed a second check to isArray
  console.log(myArray.map(x => x * 2));
}

const myArrayOfArrays: unknown = [[1], [2], [3]];
// Custom nested type predicate callback we can pass through to isArray
const isNumberArray = (arg: any): arg is number[] => typeKeeper.isArray(arg, typeKeeper.isNumber);

if (typeKeeper.isArray(myArrayOfArrays, isNumberArray)) {
  // TypeScript knows that myArray is an array of array of numbers here
  // It knows 'x' is of type array, with each element being a number, and so knows y is a number
  console.log(myArrayOfArrays.map((x) => x.map(y => y * 2)));
}

const myArray: unknown = [1, 2, 3];
if (typeKeeper.isArray<number>(myArray)) {
  // TypeScript knows that myArray is an array here and we've told it it's of type number, but 
  // we don't have a 'true' check for number, we've effectively just done an 'as number' cast
  console.log(myArray.map(x => x * 2));
}

const myString: unknown = 'hello';
if (typeKeeper.isString(myString)) {
  // TypeScript knows that myString is a string here so this is fine
  console.log(myString.toUpperCase());
}

const myObject: unknown = { a: 1, b: 2 };
if (typeKeeper.isObject(myObject)) {
  // TypeScript knows that myObject is an object here but doesn't know the signature, it's essential Record<string, any>
  console.log(myObject.a, myObject.b);
}

// Contrived object check
function customObjectCheckExample(x: any): x is { c: number } { return typeKeeper.isNumber(x.c) }

const myObject: unknown = { a: 1, b: 2 };
if (typeKeeper.isObject(myObject, customObjectCheckExample)) {
  // TypeScript knows that myObject is an object here with a property 'c' that is a number
  // TS will complain as a doesn't exist!
  console.log(myObject.a, myObject.c);
}
```

<div id='id-section2'></div>

## 📝 Contributing Code

<hr />

<div id='id-section2-1'></div>

### How to contribute summary

-   Create a branch from the `develop` branch and submit a Pull Request (PR)
    -   Explain what the PR fixes or improves
-   Use sensible commit messages which follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) specification.
-   Use a sensible number of commit messages

<div id='id-section2-2'></div>

### Version Bumping

Our versioning uses [SemVer](https://semver.org/) and our commits follow the [Conventional Commits](https://www.conventionalcommits.org/en/about/) specification.

1. Make changes
2. Commit those changes
3. Pull all the tags
4. Run `npm version [patch|minor|major]`
5. Stage the `CHANGELOG.md`, `package-lock.json` and `package.json` changes
6. Commit those changes with `git commit -m "chore: bumped version to $version"`
7. Push your changes with `git push` and push the tag with `git push origin $tagname` where `$tagname` will be `v$version` e.g. `v1.0.4`

<br />

<div id='id-section3'></div>

## ✅ Testing

<hr />

![Coverage lines](https://raw.githubusercontent.com/LaurenceStokes/typekeeper/main/badges/badge-lines.svg)
![Coverage functions](https://raw.githubusercontent.com/LaurenceStokes/typekeeper/main/badges/badge-functions.svg)
![Coverage branches](https://raw.githubusercontent.com/LaurenceStokes/typekeeper/main/badges/badge-branches.svg)
![Coverage statements](https://raw.githubusercontent.com/LaurenceStokes/typekeeper/main/badges/badge-statements.svg)

1. Clone the repository

2. Install dependencies: `npm ci`

3. Test: `npm test`

<br />

<div id='id-section4'></div>

## 📘 Changelog

<hr />

See [CHANGELOG.md](https://github.com/LaurenceStokes/typekeeper/blob/main/CHANGELOG.md)

<br />
