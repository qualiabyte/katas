'use strict'

class Grammar {}

Grammar.Digit = /^[0-9]/g
Grammar.Numeric = /^([0-9]*)(\.?)([0-9]+)/
Grammar.BinaryOperator = /^[+\-*\/%]$/
Grammar.AdditionOperator = /^\+$/
Grammar.SubtractionOperator = /^-$/
Grammar.MultiplicationOperator = /^\*$/
Grammar.DivisionOperator = /^\/$/
Grammar.ModulusOperator = /^%$/
Grammar.AssignmentOperator = /^=$/
Grammar.FunctionalKeyword = /^fn$/
Grammar.FunctionalOperator = /^=>$/
Grammar.Identifier = /^[_a-zA-z][_a-zA-Z0-9]*$/
Grammar.ExpressionStart = /\(/
Grammar.ExpressionEnd = /\)/

class Node {
  constructor () {
  }

  get value() {
    return this._value
  }

  evaluate(context) {
    return this.value
  }
}

class AST extends Node {
  constructor(root) {
    super()
    this.root = root
  }

  get value() {
    return this.root.value
  }

  evaluate(context) {
    return this.root.evaluate(context)
  }
}

class Expression extends Node {
}

class Numeric extends Expression {
  constructor (token) {
    super()
    this.type = 'Numeric'
    this.token = token
    this._value = Number.parseFloat(token)
  }
}

class Identifier extends Expression {
  constructor(token) {
    super(token)
    this.type = 'Identifier'
    this.token = token
    this.name = token
  }
}

class Variable extends Identifier {
  constructor(token) {
    super(token)
    this.type = 'Identifier'
    this.token = token
    this.name = token
    this.expression = null
    this._value = null
  }

  get value() {
    return this._value
  }

  evaluate(context) {
    if (this.expression) {
      return this.expression.evaluate(context)
    }
    else {
      let isDefined = context.vars.hasOwnProperty(this.name)
      if (isDefined)
        return context.vars[this.name]
      else
        throw new Error("Invalid identifier. Reference to undefined variable: " + this.name)
    }
  }
}

class Operation extends Expression {
  constructor() {
    super()
    this.type = 'Operation'
  }

  compare(b) {
    return Operation.compare(this, b)
  }

  static precedence(op) {
    if (op instanceof ExpressionStart)     return 4
    if (op instanceof ExpressionEnd)       return 4
    if (op instanceof Multiplication)      return 3
    if (op instanceof Division)            return 3
    if (op instanceof Modulus)             return 3
    if (op instanceof Addition)            return 2
    if (op instanceof Subtraction)         return 2
    if (op instanceof Assignment)          return 1
    if (op instanceof FunctionalOperation) return 0
    if (op instanceof Functional)          return 0
  }

  static compare(a, b) {
    return Operation.precedence(a) - Operation.precedence(b)
  }
}

class ExpressionBoundary extends Node {}

class ExpressionStart extends ExpressionBoundary {
  constructor(token) {
    super()
    this.type = 'ExpressionStart'
    this.token = token
  }
}

class ExpressionEnd extends ExpressionBoundary {
  constructor(token) {
    super()
    this.type = 'ExpressionEnd'
    this.token = token
  }
}

class ExpressionGroup extends Expression {
  constructor(token) {
    super()
    this.type = 'ExpressionGroup'
    this.token = token
    this.start = null
    this.end = null
    this.inner = null
  }
  get value() {
    return this.inner.value
  }
  evaluate(context) {
    return this.inner.evaluate(context)
  }
}

class BinaryOperation extends Operation {
  constructor (token) {
    super()
    this.type = 'BinaryOperation'
    this.token = token
    this.left = null
    this.right = null
  }
}

class Functional extends Node {
  constructor(token) {
    super(token)
    this.type = 'Functional'
    this.token = token
    this.name = null
    this.params = null
    this.body = null
  }
}

class FunctionalOperation extends BinaryOperation {
  constructor(token) {
    super(token)
    this.type = 'FunctionalOperation'
    this.token = token
    this.left = null
    this.right = null
  }
  get value() {
    return ""
  }
  evaluate(context) {
    let declaration = this
    let functional = this.left
    let name = functional.name
    let params = functional.params
    let body = functional.body

    // Check for conflicting variable
    if (context.vars[name])
      throw new Error(`Function declaration for '${name}' conflicts with existing variable`)

    // Todo: Check for undefined variables
    // console.log("Functional: ", functional)

    // Add function to context
    context.functions[name] = functional
  }
}

class Assignment extends BinaryOperation {
  constructor(token) {
    super(token)
    this.type = 'Assignment'
    this.token = token
    this.left = null
    this.right = null
  }

  get value() {
    return this.right.value
  }

  evaluate(context) {
    let assignment = this
    let variable = assignment.left
    let name = variable.name
    let value = variable.expression.evaluate(context)

    context.vars[name] = value
    variable._value = value
    return value
  }
}

class Addition extends BinaryOperation {
  get value() {
    return this.left.value + this.right.value
  }
  evaluate(context) {
    return this.left.evaluate(context) + this.right.evaluate(context)
  }
}

class Subtraction extends BinaryOperation {
  get value() {
    return this.left.value - this.right.value
  }
  evaluate(context) {
    return this.left.evaluate(context) - this.right.evaluate(context)
  }
}

class Multiplication extends BinaryOperation {
  get value() {
    return this.left.value * this.right.value
  }
  evaluate(context) {
    return this.left.evaluate(context) * this.right.evaluate(context)
  }
}

class Division extends BinaryOperation {
  get value() {
    return this.left.value / this.right.value
  }
  evaluate(context) {
    return this.left.evaluate(context) / this.right.evaluate(context)
  }
}

class Modulus extends BinaryOperation {
  get value() {
    return this.left.value % this.right.value
  }
  evaluate(context) {
    return this.left.evaluate(context) % this.right.evaluate(context)
  }
}

class Parser {
  constructor() {
    this.init([])
  }

  init(nodes) {
    this.nodes = nodes
    this.pos = 0
    this.stack = []
  }

  top() {
    return this.head(0)
  }

  last() {
    return this.head(1)
  }

  prev() {
    return this.head(2)
  }

  head(n) {
    return this.stack[this.stack.length - 1 - n]
  }

  current() {
    return this.nodes[this.pos]
  }

  next() {
    return this.nodes[this.pos + 1]
  }

  shift(node) {
    this.stack.push(this.current())
    this.pos++
  }

  reduce(rule) {
    if (rule instanceof Functional) {
      // Functional
      let functional = this.top()

      // Identifier
      this.shift()
      this.printStack()
      let identifier = this.stack.pop()
      functional.name = identifier.name

      // Parameters
      let params = []
      while (this.current() instanceof Identifier) {
        this.shift()
        this.printStack()
        let param = this.stack.pop()
        params.push(param)
      }
      functional.params = params.map(p => p.name)

      // Operation
      if (this.current() instanceof FunctionalOperation) {
        this.shift()
      }
      else {
        throw new Error("Expected functional operator '=>' at: ", this.current)
      }
    }
    else if (rule instanceof FunctionalOperation) {
      let body = this.stack.pop()
      let operation = this.stack.pop()
      let functional = this.stack.pop()

      if (!(body instanceof Expression))
        throw new Error("Expected expression for functional body at: ", body)

      if (!(functional instanceof Functional))
        throw new Error("Expected functional at: ", functional)

      operation.left = functional
      operation.right = body
      functional.body = body

      this.stack.push(operation)
    }
    else if (rule instanceof Assignment) {
      let value = this.stack.pop()
      let assignment = this.stack.pop()
      let variable = this.stack.pop()

      if (! variable instanceof Variable)
        throw new Error("Assignment to non-variable: ", variable)

      assignment.left = variable
      assignment.right = value
      variable.expression = assignment.right

      this.stack.push(assignment)
    }
    else if (rule instanceof BinaryOperation) {
      let right = this.stack.pop()
      let op = this.stack.pop()
      let left = this.stack.pop()
      op.left = left
      op.right = right

      let group = new ExpressionGroup('G')
      group.inner = op

      this.stack.push(group)
    }
  }

  parse(nodes) {
    this.init(nodes)
    return this.parseExpression(nodes)
  }

  parseExpression(nodes) {
    var iterations = 0
    while (this.pos < this.nodes.length || this.stack.length > 1) {
      this.printStack()
      if (iterations++ > 20)
        throw new Error("Exceeded limit for parser iterations")
      let current = this.nodes[this.pos]
      let next = this.nodes[this.pos + 1]
      let top = this.top()
      let last = this.last()
      let prev = this.prev()

      // Functional Keyword
      if (top instanceof Functional) {
        this.reduce(top)
        continue
      }

      // Expression Start
      if (top instanceof ExpressionStart) {
        this.shift()
        continue
      }

      // Expression End
      if (top instanceof ExpressionEnd) {
        if (prev instanceof ExpressionStart) {
          let end = this.stack.pop()
          let inner = this.stack.pop()
          let start = this.stack.pop()
          let group = new ExpressionGroup('G')
          group.inner = inner instanceof ExpressionGroup
            ? inner.inner
            : inner

          this.stack.push(group)
          continue
        }
        else {
          throw new Error("Expected expression start '(' at: ", prev)
        }
      }

      // Functional Operation
      if (top instanceof Expression &&
          last instanceof FunctionalOperation &&
          prev instanceof Functional) {
        if (current instanceof BinaryOperation &&
            current.compare(last) >= 0) {
          this.shift()
          continue
        }
        else {
          this.reduce(last)
          continue
        }
      }

      // Operation
      if (last instanceof Operation) {
        if (current instanceof Operation &&
            current.compare(last) >= 0) {
          this.shift()
          continue
        }
        else {
          this.reduce(last)
          continue
        }
      }

      if ((current instanceof ExpressionStart) ||
          (current instanceof ExpressionEnd)) {
        this.shift()
        continue
      }

      if (current instanceof Functional) {
        this.shift()
        continue
      }

      if (current instanceof Numeric) {
        this.shift()
        continue
      }

      if (current instanceof Variable) {
        this.shift()
        continue
      }

      if (current instanceof BinaryOperation) {
        this.shift()
        continue
      }
    }
    this.printStack()

    return this.top()
  }

  printStack(verbose) {
    let tokens = this.stack.map(n => n.token).join(" ")
    console.log(`Stack: [ ${tokens} ]`)

    if (verbose)
      console.log(JSON.stringify(this.stack))
  }
}

function Interpreter()
{
  this.vars = {}
  this.functions = {}
  this.parser = new Parser()
}

Interpreter.prototype.input = function(expr)
{
  console.log("Input: " + expr)
  // console.log("Interpreter: " + JSON.stringify(this, null, '__'))
  var tokens = this.tokenize(expr)

  console.log("Tokens: " + JSON.stringify(tokens, null, '__'))
  var ast = this.parse(tokens)

  console.log("AST: " + JSON.stringify(ast, null, ".."))
  return ast.evaluate(this)
}

Interpreter.prototype.tokenize = function(program)
{
  if (program == "") return []
  var regex = /\s*(=>|[-+*\/\%=\(\)]|[A-Za-z_][A-Za-z0-9_]*|[0-9]*\.?[0-9]+)\s*/g
  return program.split(regex).filter(function (s) { return !s.match(/^\s*$/); })
}

Interpreter.prototype.parse = function(tokens) {
  var nodes = this.buildNodes(tokens)

  console.log("Nodes: " + JSON.stringify(nodes, null, '>>'))
  var ast = this.buildAST(nodes)
  return ast
}

Interpreter.prototype.buildAST = function(nodes) {
  var root = this.parser.parse(nodes)
  var ast = new AST(root)
  return ast
}

Interpreter.prototype.buildNodes = function(tokens) {
  var nodes = []

  // Identify node types
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]
    var node

    // Numeric
    if (token.match(Grammar.Numeric)) {
      node = new Numeric(token)
    }
    // Binary Operations
    else if (token.match(Grammar.AdditionOperator)) {
      node = new Addition(token)
    }
    else if (token.match(Grammar.SubtractionOperator)) {
      node = new Subtraction(token)
    }
    else if (token.match(Grammar.MultiplicationOperator)) {
      node = new Multiplication(token)
    }
    else if (token.match(Grammar.DivisionOperator)) {
      node = new Division(token)
    }
    else if (token.match(Grammar.ModulusOperator)) {
      node = new Modulus(token)
    }
    else if (token.match(Grammar.AssignmentOperator)) {
      node = new Assignment(token)
    }
    else if (token.match(Grammar.FunctionalKeyword)) {
      node = new Functional(token)
    }
    else if (token.match(Grammar.FunctionalOperator)) {
      node = new FunctionalOperation(token)
    }
    else if (token.match(Grammar.Identifier)) {
      node = new Variable(token)
    }
    else if (token.match(Grammar.ExpressionStart)) {
      node = new ExpressionStart(token)
    }
    else if (token.match(Grammar.ExpressionEnd)) {
      node = new ExpressionEnd(token)
    }

    nodes.push(node)
  }
  return nodes
}
