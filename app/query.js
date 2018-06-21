//
// Copyright (c) 2018 Nathan Fiedler
//

/**
 * Returns an object containing the lists of the selected attributes.
 *
 * {
 *   locations: [location objects...],
 *   tags: [tag objects...],
 *   years: [year objects...]
 * }
 */
function getSelectedAttrs (state) {
  const locations = []
  state.locations.items.forEach((item) => {
    if (item.active) {
      locations.push(item)
    }
  })
  const tags = []
  state.tags.items.forEach((item) => {
    if (item.active) {
      tags.push(item)
    }
  })
  const years = []
  state.years.items.forEach((item) => {
    if (item.active) {
      years.push(item)
    }
  })
  return {
    locations,
    tags,
    years
  }
}

/**
 * Build the search parameters from the given selections.
 *
 * @param {Object} selections - as from getSelectedAttrs().
 */
function fromSelections (selections) {
  const locations = selections.locations.map(item => item.label)
  const tags = selections.tags.map(item => item.label)
  const years = selections.years.map(item => Number.parseInt(item.label))
  let afterTime = null
  let beforeTime = null
  if (years.length > 0) {
    afterTime = new Date(years[0], 0).getTime()
    beforeTime = new Date(years[0] + 1, 0).getTime()
  }
  return {
    locations,
    tags,
    after: afterTime,
    before: beforeTime
  }
}

/**
 * Parse the search query into a set of options to be passed to the GraphQL
 * search field.
 *
 * @param {String} query - query string for searching for assets.
 * @return {Object} parsed query in the form of an object suitable for passing
 *                  to the search field of the GraphQL Query type.
 */
function fromString (query) {
  if (query.trim().length === 0) {
    return {}
  }
  const rootNode = parse(query)
  return interpret(rootNode, {
    locations: [],
    tags: [],
    after: null,
    before: null
  })
}

//
// Parse the search query expression into an abstract syntax tree.
//
function parse (input) {
  //
  // Use Dijkstra's shunting yard algorithm to produce an AST.
  // https://en.wikipedia.org/wiki/Shunting-yard_algorithm
  //
  // An expression such as this would become the AST below:
  //
  //     tag:cat and (loc:hawaii or tag:beach)
  //
  // and
  // |
  // +- :
  // |  |
  // |  +- tag
  // |  +- cat
  // |
  // +- or
  //    |
  //    +- :
  //    |  |
  //    |  +- loc
  //    |  +- hawaii
  //    |
  //    +- :
  //       |
  //       +- tag
  //       +- beach
  //
  const parser = new Parser(input)
  return expand(parser.run())
}

// Process the parsed AST to simplify the result.
function expand (tree) {
  if (tree.type === 'quotedLiteral') {
    tree.value = tree.value.substr(1, tree.value.length - 2)
    tree.type = 'literal'
  } else if (tree.type === 'quotedArg') {
    tree.value = tree.value.substr(1, tree.value.length - 2)
    tree.type = 'argument'
  }
  tree.children = tree.children.map(e => expand(e))
  return tree
}

// Convert the AST into a set of search parameters.
function interpret (tree, params) {
  if (tree.type === 'operator' && tree.value === ':') {
    const pred = tree.children[0]
    const arg = tree.children[1]
    if (pred.value === 'loc') {
      params.locations.push(arg.value)
    } else if (pred.value === 'tag') {
      params.tags.push(arg.value)
    } else if (pred.value === 'after') {
      params.after = parseDate(arg.value)
    } else if (pred.value === 'before') {
      params.before = parseDate(arg.value)
    } else {
      throw new Error(`unknown predicate: ${pred.value}`)
    }
  } else if (tree.type === 'operator' && tree.value === 'or') {
    throw new Error('"or" operator not yet supported')
  } else {
    tree.children.reduce((acc, e) => interpret(e, acc), params)
  }
  return params
}

class Parser {
  constructor (input) {
    this.tokens = lex(input)
    this.buflen = input.length
    this.pos = 0
    // the operator stack
    this.operators = []
    // the argument stack
    this.arguments = []
  }

  run () {
    this.pos = 0
    while (true) {
      const t = this.next()
      if (t.type === 'eof') {
        return this.doEndOfFile()
      } else if (t.isRightParen) {
        this.doRightParen()
      } else if (t.isOperator) {
        // If the operator stack is empty, push the new operator. If it has an
        // operator on top, compare the precedence of the two and push the new
        // one if it has lower precedence (or equal precedence: this will
        // force left associativity). Otherwise reduce the two stacks.
        if (this.operators.length) {
          const top = this.operatorPeek()
          // Special case of consecutive : operators without an intervening and
          // operator; the and is implied and automatically added. To do that,
          // first pop the predicate that precedes the : from the argument
          // stack, then reduce the operators/arguments, and add the predicate
          // back to the arguments, and the : will be added to the operators
          // as usual for an operator.
          if (top.value === ':' && t.value === ':') {
            const pred = this.arguments.pop()
            this.reduce()
            this.arguments.push(pred)
            this.operators.push(new Token('operator', 'and', 0))
          } else if (!top.isSentinel && t.precedence >= top.precedence) {
            this.reduce()
          }
        }
        this.operators.push(t)
      } else {
        // Anything else is considered an "argument".
        this.arguments.push(t)
      }
    }
  }

  doEndOfFile () {
    // If there is only one tree on the argument stack and the operator stack is
    // empty, return the single tree as the result. If there are more trees
    // and/or operators, reduce the stacks as far as possible.
    let count = 0
    while (this.operators.length) {
      const op = this.operatorPeek()
      if (op.isLeftParen) {
        throw new Error(`unmatched left parenthesis at ${op.token.start}`)
      } else if (op.isSentinel) {
        throw new Error(`unrecognized expression at ${op.token.start}`)
      }
      this.reduce()
      count++
      if (count > 128) {
        throw new Error(`oversized operator stack at ${op.token.start}`)
      }
    }
    if (this.arguments.length) {
      const arg = this.arguments.pop()
      // if (this.arguments.length === 0 && this.operators.length === 0) {
      //   if (arg.isOperator) {
      //     return arg
      //   }
      //   const t = new Token('operator', 'and', 0)
      //   t.addChildren(arg)
      //   return t
      // }
      if (this.operators.length === 0 && arg.isOperator) {
        return arg
      }
      const t = new Token('operator', 'and', 0)
      t.addChildren(...this.arguments)
      t.addChildren(arg)
      return t
    }
  }

  doRightParen (token) {
    if (this.operators.length === 0) {
      throw new Error(`unmatched right paren at ${token.start}`)
    }
    // If there is a left parenthesis on the operator stack, cancel the pair.
    // If the operator stack contains some other operator on top, reduce the
    // stacks.
    let top = this.operatorPeek()
    while (!top.isLeftParen) {
      this.reduce()
      if (this.operators.length === 0 || top.isSentinel) {
        throw new Error(`unmatched right paren at ${token.start}`)
      }
      top = this.operatorPeek()
    }
    this.operators.pop()
  }

  reduce () {
    // If there is a binary operator on top of the operator stack, there should
    // be two trees on top of the argument stack, both representing expressions.
    // Pop the operator and two trees off, combining them into a single tree
    // node, which is then pushed back on the argument stack. Note that the
    // trees on the argument stack represent the right and left arguments,
    // respectively.
    let top = this.operators.pop()
    if (top.isBinary) {
      const arg2 = this.arguments.pop()
      const arg1 = this.arguments.pop()
      top.addChildren(arg1, arg2)
      this.arguments.push(top)
    } else {
      const arg = this.arguments.pop()
      top.addChildren(arg)
      this.arguments.push(top)
    }
  }

  operatorPeek () {
    return this.operators[this.operators.length - 1]
  }

  next () {
    if (this.pos >= this.tokens.length) {
      return new Token('eof', 'eof', this.buflen)
    }
    const t = this.tokens[this.pos]
    this.pos++
    return t
  }
}

// A Token starts as a tokenized element of the input string, and evolves into
// an element in the abstract syntax tree. It represents either an operator or
// and argument.
class Token {
  constructor (type, value, start) {
    this.type = type
    this.value = value
    this.start = start
    this.children = []
  }

  addChildren (...children) {
    for (let child of children) {
      this.children.push(child)
    }
  }

  get isOperator () {
    return this.type === 'operator'
  }

  get isBinary () {
    return this.type === 'operator' && (
      this.value === 'and' ||
      this.value === 'or' ||
      this.value === ':'
    )
  }

  get isLeftParen () {
    return this.type === 'operator' && this.value === '('
  }

  get isRightParen () {
    return this.type === 'operator' && this.value === ')'
  }

  get isSentinel () {
    return this.type === 'operator' && (
      this.value === '(' ||
      this.value === ')'
    )
  }

  get precedence () {
    switch (this.value) {
      case '-':
        return 20
      case 'and':
        return 15
      case 'or':
        return 10
      case ':':
        return 5
      case '(':
      case ')':
        return 1
    }
  }
}

// Lex the query string into an array of tokens, using the Lexer class.
function lex (query) {
  const lexer = new Lexer(query)
  return lexer.run()
}

const whitespace = '\t\n\f\v\r '
const opBound = whitespace + '('
const eof = undefined

//
// Lexer modeled after https://talks.golang.org/2011/lex.slide
//
// Lacking go channels, this lexer builds up an array of tokens.
//
class Lexer {
  constructor (input) {
    this.buf = input
    this.buflen = input.length
    this.pos = 0
    this.start = 0
    this.width = 0
    this.tokens = []
    this.fn = lexStart
  }

  emit (type) {
    this.tokens.push(new Token(
      type,
      this.buf.substring(this.start, this.pos),
      this.start
    ))
    this.start = this.pos
  }

  next () {
    if (this.pos >= this.buflen) {
      // so backup() does nothing at the end of the input
      this.width = 0
      return eof
    }
    const ch = this.buf[this.pos]
    this.pos++
    this.width = 1
    return ch
  }

  backup () {
    if (this.pos > 0) {
      this.pos -= this.width
    }
  }

  peek () {
    return this.buf[this.pos]
  }

  ignore () {
    this.start = this.pos
  }

  accept (valid) {
    if (valid.includes(this.next())) {
      return true
    }
    this.backup()
    return false
  }

  acceptString (str) {
    for (let c of str) {
      if (this.next() !== c) {
        this.backup()
        return false
      }
    }
    return true
  }

  acceptRun (valid) {
    while (valid.includes(this.next())) {}
    this.backup()
  }

  acceptRunFn (cb) {
    while (cb(this.next())) {}
    this.backup()
  }

  error (msg) {
    this.tokens = [new Token('error', msg, this.start)]
    return null
  }

  run () {
    while (this.fn) {
      this.fn = this.fn(this)
    }
    return this.tokens
  }
}

function lexNegate (lexer) {
  lexer.accept('-')
  lexer.emit('operator')
  return lexStart
}

function lexClose (lexer) {
  lexer.accept(')')
  lexer.emit('operator')
  return lexOperator
}

function lexOpen (lexer) {
  lexer.accept('(')
  lexer.emit('operator')
  return lexStart
}

function lexColon (lexer) {
  lexer.accept(':')
  lexer.emit('operator')
  return lexArg
}

function lexPredicate (lexer) {
  // our predicates are only ASCII letters
  lexer.acceptRunFn(isAsciiLetter)
  if (lexer.peek() === ':') {
    lexer.emit('predicate')
    return lexColon
  }
  return lexLiteral
}

function lexLiteral (lexer) {
  lexer.acceptRunFn(isSearchWordRune)
  lexer.emit('literal')
  return lexOperator
}

function lexArg (lexer) {
  if (lexer.peek() === '"') {
    return lexQuotedArg
  }
  lexer.acceptRunFn(isSearchWordRune)
  lexer.emit('argument')
  if (lexer.peek() === ':') {
    return lexColon
  }
  return lexOperator
}

function lexAnd (lexer) {
  if (lexer.acceptString('and') && lexer.accept(opBound)) {
    lexer.backup()
    lexer.emit('operator')
    return lexStart
  }
  return lexPredicate
}

function lexOr (lexer) {
  if (lexer.acceptString('or') && lexer.accept(opBound)) {
    lexer.backup()
    lexer.emit('operator')
    return lexStart
  }
  return lexPredicate
}

function lexQuotedLiteral (lexer) {
  if (!runQuoted(lexer)) {
    return lexer.error('unclosed quote')
  }
  lexer.emit('quotedLiteral')
  return lexOperator
}

function lexQuotedArg (lexer) {
  if (!runQuoted(lexer)) {
    return lexer.error('unclosed quote')
  }
  lexer.emit('quotedArg')
  if (lexer.peek() === ':') {
    return lexColon
  }
  return lexOperator
}

function lexStart (lexer) {
  lexer.acceptRun(whitespace)
  lexer.ignore()
  switch (lexer.peek()) {
    case eof:
      return null
    case '(':
      return lexOpen
    case ')':
      return lexClose
    case '-':
      return lexNegate
    case '"':
      return lexQuotedLiteral
  }
  return lexPredicate
}

// Here for the eventual support of operators (-, and, or)
function lexOperator (lexer) {
  lexer.acceptRun(whitespace)
  lexer.ignore()
  switch (lexer.peek()) {
    case 'a':
      return lexAnd
    case 'o':
      return lexOr
  }
  return lexStart
}

function isAsciiLetter (char) {
  // use the ES6 unicode support in regex
  return /^[a-zA-Z]$/u.test(char)
}

function isSearchWordRune (char) {
  switch (char) {
    case ':':
    case ')':
    case '(':
    case eof:
      return false
  }
  return !whitespace.includes(char)
}

function runQuoted (lexer) {
  lexer.accept('"')
  while (true) {
    switch (lexer.next()) {
      case eof:
        return false
      case '\\':
        lexer.next()
        break
      case '"':
        return true
    }
  }
}

// Parse a date such as "2018", or "2018-08", or "2018-08-30" into a Date.
function parseDate (str) {
  let parts = str.split('-')
  if (parts.length < 1 || parts.length > 3) {
    throw new Error(`invalid date string: ${str}`)
  }
  parts = parts.map(e => Number.parseInt(e))
  switch (parts.length) {
    case 3:
      return new Date(parts[0], parts[1] - 1, parts[2])
    case 2:
      return new Date(parts[0], parts[1] - 1)
    default:
      return new Date(parts[0], 0)
  }
}

module.exports = {
  fromSelections,
  fromString,
  getSelectedAttrs,
  lex, // exported for testing
  parse // exported for testing
}
