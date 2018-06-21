//
// Copyright (c) 2018 Nathan Fiedler
//
const {assert} = require('chai')
const {describe, it} = require('mocha')
const query = require('../app/query')

describe('Query', () => {
  describe('Lexer', () => {
    it('tokenizes a query string', async function () {
      const expected = [
        {children: [], start: 0, type: 'predicate', value: 'tag'},
        {children: [], start: 3, type: 'operator', value: ':'},
        {children: [], start: 4, type: 'argument', value: 'beach'},
        {children: [], start: 10, type: 'operator', value: 'and'},
        {children: [], start: 14, type: 'operator', value: '('},
        {children: [], start: 15, type: 'predicate', value: 'loc'},
        {children: [], start: 18, type: 'operator', value: ':'},
        {children: [], start: 19, type: 'argument', value: 'hawaii'},
        {children: [], start: 26, type: 'operator', value: 'or'},
        {children: [], start: 29, type: 'predicate', value: 'tag'},
        {children: [], start: 32, type: 'operator', value: ':'},
        {children: [], start: 33, type: 'quotedArg', value: '"cute girl"'},
        {children: [], start: 44, type: 'operator', value: ')'}
      ]
      const actual = query.lex('tag:beach and (loc:hawaii or tag:"cute girl")')
      assert.deepEqual(actual, expected)
    })
  })

  describe('Parser', () => {
    it('parses the query string into an AST', async function () {
      const expected = {
        type: 'operator',
        value: 'and',
        start: 10,
        children: [
          {
            type: 'operator',
            value: ':',
            start: 3,
            children: [
              {children: [], start: 0, type: 'predicate', value: 'tag'},
              {children: [], start: 4, type: 'argument', value: 'beach'}
            ]
          },
          {
            type: 'operator',
            value: 'or',
            start: 26,
            children: [
              {
                type: 'operator',
                value: ':',
                start: 18,
                children: [
                  {children: [], start: 15, type: 'predicate', value: 'loc'},
                  {children: [], start: 19, type: 'argument', value: 'hawaii'}
                ]
              },
              {
                type: 'operator',
                value: ':',
                start: 32,
                children: [
                  {children: [], start: 29, type: 'predicate', value: 'tag'},
                  {children: [], start: 33, type: 'argument', value: 'cute girl'}
                ]
              }
            ]
          }
        ]
      }
      const actual = query.parse('tag:beach and (loc:hawaii or tag:"cute girl")')
      assert.deepEqual(actual, expected)
    })

    it('single predicate and argument', async function () {
      const expected = {
        type: 'operator',
        value: ':',
        start: 3,
        children: [
          {children: [], start: 0, type: 'predicate', value: 'tag'},
          {children: [], start: 4, type: 'argument', value: 'beach'}
        ]
      }
      const actual = query.parse('tag:beach')
      assert.deepEqual(actual, expected)
    })

    it('adds implicit "and" between literals', async function () {
      const expected = {
        type: 'operator',
        value: 'and',
        start: 0,
        children: [
          {children: [], start: 0, type: 'literal', value: 'beach'},
          {children: [], start: 6, type: 'literal', value: 'hawaii'}
        ]
      }
      const actual = query.parse('beach hawaii')
      assert.deepEqual(actual, expected)
    })

    it('adds implicit "and" between : operators', async function () {
      const expected = {
        type: 'operator',
        value: 'and',
        start: 0,
        children: [{
          type: 'operator',
          value: ':',
          start: 3,
          children: [
            {children: [], start: 0, type: 'predicate', value: 'tag'},
            {children: [], start: 4, type: 'argument', value: 'beach'}
          ]
        },
        {
          type: 'operator',
          value: ':',
          start: 13,
          children: [
            {children: [], start: 10, type: 'predicate', value: 'loc'},
            {children: [], start: 14, type: 'argument', value: 'hawaii'}
          ]
        }]
      }
      const actual = query.parse('tag:beach loc:hawaii')
      assert.deepEqual(actual, expected)
    })
  })

  describe('fromString', () => {
    it('parses query string into search parameters', async function () {
      const expected = {
        tags: [
          'beach',
          'cute girl'
        ],
        locations: [
          'hawaii'
        ],
        after: null,
        before: null
      }
      const actual = query.fromString('tag:beach and tag:"cute girl" and loc:hawaii')
      assert.deepEqual(actual, expected)
    })

    it('parses query string into search parameters (sans and)', async function () {
      const expected = {
        tags: [
          'beach',
          'cute girl'
        ],
        locations: [
          'hawaii'
        ],
        after: null,
        before: null
      }
      const actual = query.fromString('tag:beach tag:"cute girl" loc:hawaii')
      assert.deepEqual(actual, expected)
    })

    it('parses date values in query string', async function () {
      const expected = {
        tags: [],
        locations: [],
        after: new Date(2017, 5),
        before: new Date(2018, 4, 13)
      }
      const actual = query.fromString('after:2017-06 and before:2018-05-13')
      assert.deepEqual(actual, expected)
    })

    it('parses date values in query string (year only)', async function () {
      const expected = {
        tags: ['beach'],
        locations: [],
        after: new Date(2017, 0),
        before: null
      }
      const actual = query.fromString('after:2017 tag:beach')
      assert.deepEqual(actual, expected)
    })
  })
})
