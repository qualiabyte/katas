#!/usr/bin/env python

import random
import pprint
pp = pprint.PrettyPrinter(indent=2)

DEBUG = False


def log(message, *argv):
    if DEBUG:
        if argv:
            print message, argv
        else:
            print message


class Heap:

    def __init__(self):
        self.root = None


    def isEmpty(self):
        return self.root == None


    def insert(self, priority, value):
        log("\nINSERT")

        node = HeapNode(priority, value)
        if self.root is None:
            self.root = node
        else:
            self.root = self.percolateDown(self.root, node)


    def percolateDown(self, root, node):
        log("PERCOLATE DOWN {}, {}".format(root.priority, node.priority))

        # Swap with root if node is smaller
        if node and root and node.priority < root.priority:
            node.left, node.right = root.left, root.right
            root.left, root.right = None, None
            node, root = root, node

        # Fill root if none
        if root is None:
            root = node

        # Fill empty left branch
        elif root.left is None:
            root.left = node

        # Fill empty right branch
        elif root.right is None:
            root.right = node

        # Two children: Percolate down left or right branch
        elif random.random() < 0.5:
            root.left = self.percolateDown(root.left, node)
        else:
            root.right = self.percolateDown(root.right, node)

        return root


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
        hole = HeapNode()
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


class HeapNode:

    def __init__(self, priority=None, value=None):
        self.priority = priority
        self.value = value
        self.left = None
        self.right = None
        self.empty = True if (priority, value) == (None, None) else False


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
            result += "HeapNode(%s, %s)" % (self.priority, self.value)

        if self.left:
            result += "\n  %sLeft:  %s" % (prefix, self.left.to_string(depth + 1))

        if self.right:
            result += "\n  %sRight: %s" % (prefix, self.right.to_string(depth + 1))

        return result


class HeapTest:

    def run(self):
        print "Testing Heap"
        self.testInsert()
        self.testRemoveMin()
        print "Passed Heap Tests!"


    def testInsert(self):
        print "Testing Heap#insert()"

        heap = Heap()

        heap.insert(4, "David")
        assert heap.root.value is 'David', "Heap#insert() should a value to the heap"

        heap.insert(2, "Bob")
        assert heap.root.value is 'Bob', "Heap#insert() should add smaller value to top of heap"

        heap.insert(5, "Eve")
        assert heap.root.value is 'Bob', "Heap#insert() should add largest values to bottom of heap"

        heap.insert(1, "Alice")
        assert heap.root.value is 'Alice', "Heap#insert() should add smallest value to top of heap"

        heap.insert(3, "Carol")
        assert heap.root.value is 'Alice', "Heap#insert() should keep smallest value at top of heap"

        log(heap)


    def testRemoveMin(self):
        print "Testing Heap#removeMin()"

        heap = Heap()

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
        assert actual == expected, "Heap#removeMin() should remove lowest priority items first"


def main():
    test = HeapTest()
    test.run()


if __name__ == "__main__":
    main()
