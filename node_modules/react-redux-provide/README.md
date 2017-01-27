# react-redux-provide

[![build status](https://img.shields.io/travis/loggur/react-redux-provide/master.svg?style=flat-square)](https://travis-ci.org/loggur/react-redux-provide) [![npm version](https://img.shields.io/npm/v/react-redux-provide.svg?style=flat-square)](https://www.npmjs.com/package/react-redux-provide)
[![npm downloads](https://img.shields.io/npm/dm/react-redux-provide.svg?style=flat-square)](https://www.npmjs.com/package/react-redux-provide)


## Table of contents

1.  [Introduction](#introduction)
2.  [Documentation](#documentation)
3.  [Installation](#installation)


## Introduction

This library aims to make it as quick and easy as possible to build applications with [React](https://facebook.github.io/react/) and [Redux](http://redux.js.org/).

It enforces a separation of concerns.  It keeps user interface decoupled from application state.  It keeps application state decoupled from data sources.

Build your UI with [React](https://facebook.github.io/react/).

Manage application state with [Redux](http://redux.js.org/) providers.

Persist and share application state with [replication](https://github.com/loggur/redux-replicate).

Use [pure functions](https://en.wikipedia.org/wiki/Pure_function) everywhere.

You can use this library to build applications of any size and complexity, for the real world or for fun.

Familiar with [React](https://facebook.github.io/react/) and [Redux](http://redux.js.org/) (including [react-redux](https://github.com/reactjs/react-redux))?  You can use your same tools and libraries.  Everything you've learned still applies.  You've probably recognized patterns when connecting Redux to your React components.  You've probably recognized patterns when optimizing updates for efficiency.  This library is an abstraction of these patterns.  By default, it minimizes boilerplate and maximizes efficiency.

Unfamiliar with [React](https://facebook.github.io/react/) and/or [Redux](http://redux.js.org/)?  This library should hopefully still be easy for you to learn.  Simplicity is key when building software, and this library is as simple as it gets.


## Documentation

Checkout the full documentation at [https://loggur.github.io/react-redux-provide/](https://loggur.github.io/react-redux-provide/).


## Installation

```
npm install react-redux-provide --save
```

And then at the very beginning of your app:

```js
import 'react-redux-provide/lib/install';
```

> **Note:** If you need to disable the automatic wrapper for specific components (usually 3rd party components), set a static `__provide` property to `false` on the component - e.g., `SomeComponent.__provide = false`.

> This is only necessary until React has a better `context` API.

If you'd rather not use the `install` method, you must wrap your top component with the [`provide`](#provide) function so that `providers` can be retrieved via `context`, assuming you follow convention and actually pass your `providers` to the top component.

