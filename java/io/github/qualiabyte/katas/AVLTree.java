package io.github.qualiabyte.katas;

import java.lang.Math;

public class AVLTree
{
  public AVLTree()
  {
    root = null;
  }

  public AVLNode find(Comparable key)
  {
    if (root == null)
      return null;
    else
      return root.find(key);
  }

  public AVLNode findMin()
  {
    if (root == null)
      return null;
    else
      return root.findMin();
  }

  public AVLNode findMax()
  {
    if (root == null)
      return null;
    else
      return root.findMax();
  }

  public AVLNode insert(Comparable key, Object value)
  {
    if (root == null)
      root = new AVLNode(key, value);
    else
      root = root.insert(key, value);

    return root;
  }

  public AVLNode remove(Comparable key)
  {
    if (root == null)
      return null;
    else
      root = root.remove(key);

    return root;
  }

  public String toString()
  {
    String result = "AVLTree: ";
    if (root != null)
      result += root.toString();
    else
      result += "Null";
    return result;
  }

  public AVLNode root;
}

class AVLNode
{
  public AVLNode(Comparable key, Object value)
  {
    this(key, value, null, null, 0);
  }

  public AVLNode(Comparable key, Object value, AVLNode left, AVLNode right, int height)
  {
    this.key = key;
    this.value = value;
    this.height = height;
    this.left = left;
    this.right = right;
  }

  public AVLNode find(Comparable key)
  {
    if (key.compareTo(this.key) < 0)
      return left.find(key);

    else if (key.compareTo(this.key) > 0)
      return right.find(key);

    else if (key.compareTo(this.key) == 0 && !this.deleted)
      return this;

    else
      return null;
  }

  public AVLNode findMin()
  {
    AVLNode current = this;
    AVLNode min = !deleted ? this : null;

    while (current.left != null)
    {
      current = current.left;
      if (!current.deleted)
        min = current;
    }

    return min;
  }

  public AVLNode findMax()
  {
    AVLNode current = this;
    AVLNode max = !deleted ? this : null;

    while (current.right != null)
    {
      current = current.right;
      if (!current.deleted)
        max = current;
    }

    return max;
  }

  public AVLNode insert(Comparable key, Object value)
  {
    AVLNode root = this;

    if (key.compareTo(this.key) < 0)
      root.left = root.left != null
        ? left.insert(key, value)
        : new AVLNode(key, value);

    else if (key.compareTo(this.key) > 0)
      root.right = root.right != null
        ? right.insert(key, value)
        : new AVLNode(key, value);

    else if (key.compareTo(this.key) == 0)
      root.value = value;

    root = root.updateBalance(key);
    root.updateHeight();

    return root;
  }

  public AVLNode updateBalance(Comparable lastKey)
  {
    AVLNode root = this;
    int diff = height(left) - height(right);

    if (diff == 2)
      if (lastKey.compareTo(left.key) < 0)
        root = rotateWithLeftChild(this);
      else
        root = doubleWithLeftChild(this);

    else if (diff == -2)
      if (lastKey.compareTo(right.key) > 0)
        root = rotateWithRightChild(this);
      else
        root = doubleWithRightChild(this);

    return root;
  }

  public int updateHeight()
  {
    height = 1 + Math.max(height(left), height(right));
    return height;
  }

  public static AVLNode rotateWithLeftChild(AVLNode k2)
  {
    AVLNode k1 = k2.left;
    k2.left = k1.right;
    k1.right = k2;
    k1.updateHeight();
    k2.updateHeight();
    return k1;
  }

  public static AVLNode doubleWithLeftChild(AVLNode k3)
  {
    k3.left = rotateWithRightChild(k3.left);
    return rotateWithLeftChild(k3);
  }

  public static AVLNode doubleWithRightChild(AVLNode k1)
  {
    k1.right = rotateWithLeftChild(k1.right);
    return rotateWithRightChild(k1);
  }

  public static AVLNode rotateWithRightChild(AVLNode k1)
  {
    AVLNode k2 = k1.right;
    k1.right = k2.left;
    k2.left = k1;
    k1.updateHeight();
    k2.updateHeight();
    return k2;
  }

  public static int height(AVLNode node)
  {
    return node != null ? node.height : -1;
  }

  public AVLNode remove(Comparable key)
  {
    AVLNode root = this;

    if (key.compareTo(this.key) < 0)
      root.left = left.remove(key);

    else if (key.compareTo(this.key) > 0)
      root.right = right.remove(key);

    else if (key.compareTo(this.key) == 0)
      root.deleted = true;

    return root;
  }

  public String toString()
  {
    return this.toString(0);
  }

  public String toString(int depth)
  {
    String result = "";
    String prefix = "\n";

    for (int i = 0; i < depth; i++)
      prefix += "  ";

    if (left != null)
      result += prefix + "Left: " + left.toString(depth + 1);

    if (this != null)
      result += prefix + "Node: " + key + " -> " + value;

    if (this.deleted)
      result += "(DELETED)";

    if (right != null)
      result += prefix + "Right: " + right.toString(depth + 1);

    return result;
  }

  AVLNode left;
  AVLNode right;
  Comparable key;
  Object value;
  int height;
  boolean deleted;
}

class AVLTreeTests extends Tests
{
  public static void run()
  {
    log("Testing AVLTree");
    testAVLTree();
    log("Passed AVLTree Tests!");
  }

  public static void testAVLTree()
  {
    testInsert();
    testFind();
    testRemove();
  }

  public static void testInsert()
  {
    log("Testing AVLTree#insert(key, value)");
    AVLTree tree = new AVLTree();

    tree.insert(1, "Alice");
    tree.insert(2, "Bob");
    tree.insert(3, "Carol");
    tree.insert(4, "David");
    tree.insert(5, "Eve");

    log(tree.toString());

    if (tree.find(1).value != "Alice")
      throw new Error("Tree.add() should add first node");

    if (tree.find(2).value != "Bob")
      throw new Error("Tree.add() should add second node");

    if (tree.find(3).value != "Carol")
      throw new Error("Tree.add() should add third node");

    if (tree.find(4).value != "David")
      throw new Error("Tree.add() should add fourth node");

    if (tree.find(5).value != "Eve")
      throw new Error("Tree.add() should add fifth node");
  }

  public static AVLTree setup()
  {
    AVLTree tree = new AVLTree();

    tree.insert(1, "Alice");
    tree.insert(2, "Bob");
    tree.insert(3, "Carol");
    tree.insert(4, "David");
    tree.insert(5, "Eve");

    return tree;
  }

  public static void testFind()
  {
    AVLTree tree = setup();

    log("Testing AVLTree#find(key)");
    if (tree.find(3).value != "Carol")
      throw new Error("Tree.find() should find node with given key");

    log("Testing AVLTree#findMin(key)");
    if (tree.findMin().value != "Alice")
      throw new Error("Tree.FindMin() should find node with smallest key");

    log("Testing AVLTree#findMax(key)");
    if (tree.findMax().value != "Eve")
      throw new Error("Tree.findMax() should find node with largest key");
  }

  public static void testRemove()
  {
    log("Testing AVLTree#remove(key)");
    AVLTree tree = setup();

    AVLNode before = tree.find(3);
    AVLNode root = tree.remove(3);
    AVLNode after = tree.find(3);

    log(tree.toString());

    if (before == null)
      throw new Error("Node should exist in tree before removal");

    if (after != null)
      throw new Error("Tree.remove() should remove a node with given key");

    if (root.value != tree.root.value)
      throw new Error("Tree.remove() should return the root node");
  }

  public static void main(String[] args)
  {
    try
    {
      AVLTreeTests.run();
    }
    catch (Error e)
    {
      log(e.toString());
      System.exit(1);
    }
  }
}
