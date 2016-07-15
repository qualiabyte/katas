'use strict'

class Node {
  constructor(value, next, prev) {
    this.value = value
    this.next = next
    this.prev = prev
  }
}

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
