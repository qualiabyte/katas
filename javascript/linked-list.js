'use strict'

/**
 * The Node class represents an element in a doubly linked list.
 *
 * # Examples
 *
 *     // Create nodes with given values
 *     let foo = new Node('a')
 *     let bar = new Node('c')
 *
 *     // Create linked node
 *     let node = new Node('b', foo, bar)
 *
 *     // Link other nodes
 *     foo.next = node
 *     bar.prev = node
 *
 *     // Test this node
 *     assert.equal(node.value, 'b', "The node value is 'b'")
 *     assert.equal(node.prev, foo, "The previous node is foo")
 *     assert.equal(node.next, bar, "The next node is bar")
 *
 * @member {Node} next The next linked node.
 * @member {Node} prev The previous linked node.
 * @member {object} value The value of this node.
 */
class Node {
  constructor(value, prev, next) {
    this.value = value
    this.next = next
    this.prev = prev
  }
}

/**
 * The List class implements a doubly linked list.
 *
 * # Examples
 *
 *     // Create a new list
 *     let list = new List()
 *
 *     // Add some values
 *     list.add('a')
 *     list.add('b')
 *     list.add('c')
 *
 *     // Remove one node by value
 *     list.remove('b')
 *
 *     // Get the head and tail
 *     let head = list.head
 *     let tail = list.tail
 *
 *     // Check the list
 *     assert.equal(head.value, 'a', "The head value is 'a'")
 *     assert.equal(tail.value, 'b', "The tail value is 'c'")
 *     assert.equal(list.length, 2, "The list length is 2")
 *
 * # Analysis
 *
 *     list:        O(N) space, to store all elements
 *     list.add:    O(1) time, to append element to the end
 *     list.remove: O(0.5N) time on average, O(N) worst case, O(1) best case
 *
 * @member {Node} head The first element in the list.
 * @member {Node} tail The last element in the list.
 * @member {number} length The number of list elements.
 */
class List {
  constructor() {
    this.head = null
    this.tail = null
    this.length = 0
  }

  // Adds a node with given value to the list.
  add(value) {
    if (this.head == null) {
      this.head = new Node(value)
      this.tail = this.head
      this.length = 1
    }
    else {
      let tail = this.tail
      let node = new Node(value)

      // Add node to list
      tail.next = node
      node.prev = tail
      this.length++

      // Update tail
      this.tail = node
    }
  }

  // Removes a node with given value from the list.
  remove(value) {
    let node = this.head

    while (node != null) {

      // Remove matching nodes
      if (node.value == value) {
        let next = node.next
        let prev = node.prev

        // Delete node from list
        if (next) next.prev = prev
        if (prev) prev.next = next
        this.length--

        // Update head and tail
        if (node == this.head) this.head = next
        if (node == this.tail) this.tail = prev

        // Return the deleted node
        return node
      }

      node = node.next
    }

    return null
  }
}

class Tests {
  constructor() {
  }

  assert(value, message) {
    if (!value)
      throw new Error(message)
  }

  run() {
    console.log("Testing Linked List")
    this.testAdd()
    this.testRemove()
  }

  testAdd() {
    console.log("Testing add...")

    let list = new List()

    list.add('a')
    list.add('b')
    list.add('c')

    let first = list.head
    let second = first.next
    let third = list.tail

    this.assert(list.length == 3, "List should have three items")
    this.assert(first.value == 'a', "First value should be 'a'")
    this.assert(second.value == 'b', "Second value should be 'b'")
    this.assert(third.value == 'c', "Third value should be 'c'")
    this.assert(first.prev == null, "First value should have no previous node")
    this.assert(third.next == null, "First value should have no next node")
  }

  testRemove() {
    console.log("Testing remove...")

    let list = new List()

    list.add('a')
    list.add('b')
    list.add('c')
    list.remove('b')

    let first = list.head
    let last = first.next

    this.assert(list.length == 2, "List should have two items")
    this.assert(first.value == 'a', "First value should be 'a'")
    this.assert(last.value == 'c', "Last value should be 'c'")
  }
}

let tests = new Tests()
tests.run()
