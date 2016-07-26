#!/usr/bin/env python

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

        # Let node percolate down
        if root is None:
            # Fill root if none
            root = node

        elif root.empty:
            # Found a hole
            hole = root

            # Find smallest child
            if not root.left and not root.right:
                minChild = None
                return minChild
            elif not root.left:
                minChild = root.right
            elif not root.right:
                minChild = root.left
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
                root.left = self.percolateDown(root.left, hole)
            else:
                root.right = self.percolateDown(root.right, hole)

        elif root.left is None:
            # Fill empty left branch
            root.left = node

        elif root.right is None:
            # Fill empty right branch
            root.right = node

        else:
            # Two children: percolate down left branch
            root.left = self.percolateDown(root.left, node)

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
        self.root = self.percolateDown(self.root, hole)

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

    def __str__(self):
        return self.to_string(0)


class HeapTest:

    def run(self):
        heap = Heap()

        heap.insert(4, "David")
        heap.insert(2, "Bob")
        heap.insert(5, "Eve")
        heap.insert(1, "Alice")
        heap.insert(3, "Carol")
        log(heap)

        actual = []

        for i in range(5):
            smallest = heap.removeMin()
            actual.append(smallest.value)
            log(heap)

        log("Actual:", actual)
        expected = [ "Alice", "Bob", "Carol", "David", "Eve" ]
        assert actual == expected, "Heap#removeMin() should remove lowest priority items first"


def main():
    test = HeapTest()
    test.run()


if __name__ == "__main__":
    main()
