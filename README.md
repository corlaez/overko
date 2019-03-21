# **_Overko_**

[![CircleCI](https://circleci.com/gh/lrn2prgrm/overko.svg?style=svg)](https://circleci.com/gh/lrn2prgrm/overko)
[![CircleCI Status](https://circleci.com/gh/lrn2prgrm/overko.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/lrn2prgrm/overko)

State management for [Knockoutjs](https://knockoutjs.com/).

## Motivation

- I will soon work with Knockout in 2019 for the first time.
- The great testability and [TypeScript](https://www.typescriptlang.org/) support that the [Overmind](https://overmindjs.org) app's have.

## Comparison to Overmind

In an Overmind React app we would have the following modules:

- react (view),
- overmind-react (bindings)
- overmind (state management with proxy updates)

And in an Overko app we will have:

- knockout (view)
- overko (bindings + state management with knockout observable updates)

> Since overko uses Knockout's observables makes the library pretty light and simple to use.

## Missing Overmind features

- Derive addMutationListener, addFlushListener are not included. (I feel you can replace these with knockout's features so they might never get added)

- Namespaced/Nested state. (It would be a nice add but I left it out for now)

- Functional actions, SSR. I don't have an use case for them yet. (I feel okay to leave them out)

- Make bindings for other view libraries. (no way)

## Shoutouts

[Christian Alfoni](https://github.com/christianalfoni/) for making [Overmind](https://overmindjs.org) and producing tons of OSS and [articles](https://medium.com/@christianalfoni). This lib is heavily based on Overmind's api and features. Definetly check it out if you aren't convinced enough with your current state library in React, Vue or Angular.

[Alex Bainter](https://alexbainter.com) for the great [article](https://journal.artfuldev.com/write-tests-for-typescript-projects-with-mocha-and-chai-in-typescript-86e053bdb2b6) about modern Knockout development and simple [knockout-store](https://github.com/Spreetail/knockout-store) he created.
