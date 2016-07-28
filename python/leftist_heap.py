#!/usr/bin/env python

import random
import pprint
import sys


pp = pprint.PrettyPrinter(indent=2)
DEBUG = False


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

        # Fill right node if missing right
        elif not smaller.root.right:
            smaller.root.right = h2.root

        # Merge with right node if present
        elif smaller.root.right:
            minRight = smaller.root.right
            smaller.root.right = minRight.merge(h2.root)

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


    def percolateHoleDown(self, hole):
        root = hole

        # One child or less: Allow escape through missing child
        if not root.left and not root.right:
            return None

        elif not root.left:
            return root.right

        elif not root.right:
            return root.left

        # Two children: Percolate down through smaller child
        elif root.left.priority < root.right.priority:
            minChild = root.left
        else:
            minChild = root.right

        # Pull smallest child up
        root.priority = minChild.priority
        root.value = minChild.value

        # Push hole into smallest child
        root.empty = False
        minChild.empty = True

        # Percolate hole down
        if root.left == minChild:
            root.left = self.percolateHoleDown(root.left)
        else:
            root.right = self.percolateHoleDown(root.right)

        return root


    def removeMin(self):
        log("\nREMOVE MIN")
        log(self)

        # Save the smallest node
        min = self.root

        # Create a new hole
        hole = LeftistNode()
        hole.left = self.root.left
        hole.right = self.root.right

        # Replace the root
        self.root = hole

        # Percolate the hole down
        self.root = self.percolateHoleDown(hole)

        log("MIN: %s" % min.value)
        return min


    def __str__(self):
        return "Heap()\nRoot: %s" % self.root


class LeftistNode:

    def __init__(self, priority=None, value=None):
        self.priority = priority
        self.value = value
        self.left = None
        self.right = None
        self.empty = True if (priority, value) == (None, None) else False


    def merge(self, other):
        h1 = LeftistHeap()
        h2 = LeftistHeap()
        h1.root = self
        h2.root = other
        h = LeftistHeap.mergeHeaps(h1, h2)
        return h.root


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
