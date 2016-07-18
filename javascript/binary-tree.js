'use strict'

/**
 * # Phone Number Registry
 *
 * In this kata, your task is to store phone numbers in such a way
 * that the following operations can be done efficiently:
 *
 *     // Register a requested number to the system, if available.
 *     registry.registerPhoneNumber(String phoneNumber)
 *
 *     // Register any available number.
 *     registry.registerPhoneNumber()
 *
 * To do this, you can use a binary tree with the following approach:
 *
 * 1. Whenever a number is registered, add it to the binary tree.
 *
 * 2. When registering a requested number, search the tree first.
 *    If it exists, fail by throwing an error.
 *    If it's free, add it to the tree and return the number.
 *
 * 3. When registering any available number:
 *    First generate a random phone number, then search the tree.
 *    If it exists, simply generate another number and retry.
 *    If it's free, add it to the tree and return this number.
 *
 * For an additional challenge, change the automatic allocation to sequentially
 * allocate numbers starting with the lowest available. Then allow removal of
 * existing numbers. Try implementing the binary tree yourself. Describe its
 * performance characteristics using Big O notation.
 */

/**
 * The PhoneRegistry class models a registry of phone numbers.
 * It stores existing phone numbers and allows registering new ones.
 */
class PhoneRegistry
{
  constructor()
  {
    this.phoneNumbers = new BinaryTree()
  }
  registerPhoneNumber(number) {}
  registerAnyPhoneNumber() {}
}

class BinaryTree
{
  constructor()
  {
    this.root = new Node()
  }
  insert(value) {}
  remove(value) {}
  find(value) {}
}

class Node
{
  constructor()
  {
    this.left = null
    this.right = null
    this.parent = null
  }
}

if (global.require)
{
  var assert = require('assert')
}

class Tests {

  constructor()
  {
  }

  run()
  {
    this.testRegistration()
    this.testAutoRegistration()
    this.testRemoval()
  }

  setup()
  {
    let registry = new PhoneRegistry()

    // Add 5 sequential numbers
    registry.registerPhoneNumber('1 000 000 0000')
    registry.registerPhoneNumber('1 000 000 0001')
    registry.registerPhoneNumber('1 000 000 0002')
    registry.registerPhoneNumber('1 000 000 0003')
    registry.registerPhoneNumber('1 000 000 0004')

    // Add 5 random numbers
    registry.registerPhoneNumber('1 111 222 3333')
    registry.registerPhoneNumber('1 123 456 7890')
    registry.registerPhoneNumber('1 456 789 0123')
    registry.registerPhoneNumber('1 555 666 7777')
    registry.registerPhoneNumber('1 999 888 7777')

    return registry
  }

  testRegistration()
  {
    let registry = this.setup()

    assert.throws(() => { registry.registerPhoneNumber('1 123 456 7890') },
      `Registering an assigned number should fail.`)

    assert.doesNotThrow(() => { registry.registerPhoneNumber('1 987 654 3210') },
      `Registering an available number should succeed`)
  }

  testAutoRegistration()
  {
    let registry = this.setup()

    let actual = [
      registry.registerAnyPhoneNumber(),
      registry.registerAnyPhoneNumber(),
      registry.registerAnyPhoneNumber()
    ]

    let expected = [
      '1 000 000 0005',
      '1 000 000 0006',
      '1 000 000 0007'
    ]

    assert.deepEqual(actual, expected,
      `Automatic registration should be sequential`)
  }

  testRemoval()
  {
    let registry = this.setup()

    registry.remove('1 000 000 0001')
    registry.remove('1 000 000 0003')
    registry.remove('1 000 000 0004')

    let actual = [
      registry.registerPhoneNumber('1 000 000 0001'),
      registry.registerAnyPhoneNumber(),
      registry.registerAnyPhoneNumber()
    ]

    let expected = [
      '1 000 000 0001',
      '1 000 000 0003',
      '1 000 000 0004'
    ]

    assert.deepEqual(actual, expected,
      `Removed numbers should allow registration`)
  }
}

let tests = new Tests()
tests.run()
