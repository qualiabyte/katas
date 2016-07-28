#!/usr/bin/env python

import random
import pprint
import sys


DEBUG = True
pp = pprint.PrettyPrinter(indent=2)


def log(message, *argv):
    if DEBUG:
        if argv:
            print message, argv
        else:
            print message


def say(message):
    sys.stdout.write(message)
    sys.stdout.flush()


class LeftistHeap:

    def __init__(self):
        self.root = None


    def isEmpty(self):
        return self.root == None


    def insert(self, priority, value):
        log("\nINSERT")

        node = LeftistNode(priority, value)

        if self.root is None:
            # Fill root if missing
            self.root = node
        else:
            # Create new heap for node
            heap = LeftistHeap()
            heap.insert(priority, value)

            # Merge with new heap
            self.merge(heap)


    def merge(self, heap2):
        heap1 = self
        merged = LeftistHeap.mergeHeaps(heap1, heap2)
        self.root = merged.root
        return self.root


    @staticmethod
    def mergeHeaps(h1, h2):
        print "MERGE HEAPS {} {}".format(
            str(h1.root.priority) if h1 and h1.root else '',
            str(h2.root.priority) if h2 and h2.root else '')

        # Find smaller heap
        smaller = LeftistHeap.findMinHeap(h1, h2)

        # Swap if h2 is smaller
        if smaller is h2:
            h1, h2 = h2, h1

        # Return empty heap if missing root
        if not smaller.root:
            return smaller

        # Fill left node if missing
        elif not smaller.root.left:
            smaller.root.left = h2.root

        # Fill right node if missing right
        elif not smaller.root.right:
            smaller.root.right = h2.root

        # Merge with right node if present
        elif smaller.root.right:
            minRight = smaller.root.right
            smaller.root.right = minRight.merge(h2.root)
            smaller.root.makeLeftist()

        smaller.root.update()

        return smaller


    @staticmethod
    def findMinHeap(h1, h2):
        if not h1.root and not h2.root:
            return h1
        elif not h1.root:
            return h2
        elif not h2.root:
            return h1
        elif h1.root.priority < h2.root.priority:
            return h1
        else:
            return h2


    def removeMin(self):
        log("\nREMOVE MIN")
        log(self)

        # Save the smallest node
        min = self.root

        # Replace root with minimum of merged children
        if not self.root:
            self.root = None
        elif not self.root.left and not self.root.right:
            self.root = None
        elif not self.root.left:
            self.root = self.root.right
        elif not self.root.right:
            self.root = self.root.left
        else:
            self.root = self.root.left.merge(self.root.right)

        log("MIN: %s" % min.value)

        return min


    def __str__(self):
        return "Heap()\nRoot: %s" % self.root


class LeftistNode:

    # Initialises the node.
    def __init__(self, priority=None, value=None):
        self.priority = priority
        self.value = value
        self.left = None
        self.right = None
        self.nullPathLength = 0
        self.empty = True if (priority, value) == (None, None) else False


    # Merges this node with another.
    def merge(self, other):
        h1 = LeftistHeap()
        h2 = LeftistHeap()
        h1.root = self
        h2.root = other
        h = LeftistHeap.mergeHeaps(h1, h2)
        return h.root


    # Enforces the leftist heap property.
    def makeLeftist(self):
        if self.left.nullPathLength < self.right.nullPathLength:
            self.swapChildren()


    # Swaps left and right children.
    def swapChildren(self):
        self.left, self.right = self.right, self.left


    # Updates state after children have changed.
    def update(self):
        self.updateNullPathLength()


    # Updates null path length for this node.
    def updateNullPathLength(self):
        if not self.left and not self.right:
            npl = 0
        elif not self.left:
            npl = 1 + self.right.nullPathLength
        elif not self.right:
            npl = 1 + self.left.nullPathLength
        else:
            npl = 1 + min(self.left.nullPathLength, self.right.nullPathLength)

        self.nullPathLength = npl


    def __nonzero__(self):
        return self.empty != True


    def __str__(self):
        return self.to_string(0)


    def to_string(self, depth):
        result = ""
        prefix = ""
        for i in range(depth):
          prefix += "  "

        if self:
            result += "LeftistNode(%s, %s)" % (self.priority, self.value)

        if self.left:
            result += "\n  %sLeft:  %s" % (prefix, self.left.to_string(depth + 1))

        if self.right:
            result += "\n  %sRight: %s" % (prefix, self.right.to_string(depth + 1))

        return result


class LeftistHeapTest:

    def run(self):
        print "Testing LeftistHeap"
        self.testInsert()
        self.testRemoveMin()
        print "Passed LeftistHeap Tests!"


    def testInsert(self):
        print "Testing LeftistHeap#insert()"

        heap = LeftistHeap()

        heap.insert(4, "David")
        assert heap.root.value is 'David', "LeftistHeap#insert() should a value to the heap"

        heap.insert(2, "Bob")
        assert heap.root.value is 'Bob', "LeftistHeap#insert() should add smaller value to top of heap"

        heap.insert(5, "Eve")
        assert heap.root.value is 'Bob', "LeftistHeap#insert() should add largest values to bottom of heap"

        heap.insert(1, "Alice")
        assert heap.root.value is 'Alice', "LeftistHeap#insert() should add smallest value to top of heap"

        heap.insert(3, "Carol")
        assert heap.root.value is 'Alice', "LeftistHeap#insert() should keep smallest value at top of heap"

        log(heap)


    def testRemoveMin(self):
        print "Testing LeftistHeap#removeMin()"

        heap = LeftistHeap()

        heap.insert(4, "David")
        heap.insert(2, "Bob")
        heap.insert(5, "Eve")
        heap.insert(1, "Alice")
        heap.insert(3, "Carol")
        heap.insert(9, "Ikari")
        heap.insert(7, "Gendo")
        heap.insert(10, "Joris")
        heap.insert(6, "Faye")
        heap.insert(8, "Hamlet")
        log(heap)

        actual = []

        while not heap.isEmpty():
            smallest = heap.removeMin()
            actual.append(smallest.value)
            log(heap)

        log("Actual:", actual)
        expected = [ "Alice", "Bob", "Carol", "David", "Eve", "Faye", "Gendo", "Hamlet", "Ikari", "Joris" ]
        assert actual == expected, "LeftistHeap#removeMin() should remove lowest priority items first"


def main():
    test = LeftistHeapTest()
    test.run()


if __name__ == "__main__":
    main()
