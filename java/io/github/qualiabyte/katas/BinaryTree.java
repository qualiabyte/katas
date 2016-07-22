package io.github.qualiabyte.katas;

public class BinaryTree<K extends Comparable,V>
{
  public BinaryTree()
  {
    root = null;
  }

  public Node<K,V> insert(K key, V value)
  {
    root = insert(key, value, root);
    return root;
  }

  public Node<K,V> find(K key)
  {
    return find(key, root);
  }

  public Node<K,V> findMin()
  {
    return findMin(root);
  }

  public Node<K,V> findMax()
  {
    return findMax(root);
  }

  public Node<K,V> remove(K key)
  {
    return remove(key, root);
  }

  public Node<K,V> insert(K key, V value, Node<K,V> root)
  {
    if (root == null)
      root = new Node<K,V>(key, value);

    else if (key.compareTo(root.key) == 0)
      root.value = value;

    else if (key.compareTo(root.key) < 0)
      root.left = insert(key, value, root.left);

    else if (key.compareTo(root.key) > 0)
      root.right = insert(key, value, root.right);

    return root;
  }

  public Node<K,V> find(K key, Node<K,V> root)
  {
    if (root == null)
      return null;

    else if (key.compareTo(root.key) < 0)
      return find(key, root.left);

    else if (key.compareTo(root.key) > 0)
      return find(key, root.right);

    else
      return root;
  }

  public Node<K,V> findMin(Node<K,V> root)
  {
    if (root.left != null)
      return findMin(root.left);
    else
      return root;
  }

  public Node<K,V> findMax(Node<K,V> root)
  {
    if (root.right!= null)
      return findMax(root.right);
    else
      return root;
  }

  public Node<K,V> remove(K key, Node<K,V> root)
  {
    if (root == null)
      root = null;

    else if (key.compareTo(root.key) < 0)
      root.left = remove(key, root.left);

    else if (key.compareTo(root.key) > 0)
      root.right = remove(key, root.right);

    else if (root.left != null && root.right != null)
      root = replaceWithRightMin(root);

    else if (root.left != null)
      root = root.left;

    else if (root.right != null)
      root = root.right;

    return root;
  }

  private Node<K,V> replaceWithRightMin(Node<K,V> root)
  {
      Node<K,V> smallest = findMin(root.right);
      root.key = smallest.key;
      root.value = smallest.value;
      root.right = remove(smallest.key, root.right);
      return root;
  }

  public String toString()
  {
    String result = "BinaryTree: ";
    if (root != null)
      result += root.toString();
    else
      result += "Null";
    return result;
  }

  public Node<K,V> root;
}

class Node<K,V>
{
  public Node()
  {
    this(null, null);
  }

  public Node(K key, V value)
  {
    this(key, value, null, null);
  }

  public Node(K key, V value, Node left, Node right)
  {
    this.key = key;
    this.value = value;
    this.left = left;
    this.right = right;
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

    if (right != null)
      result += prefix + "Right: " + right.toString(depth + 1);

    return result;
  }

  public K key;
  public V value;
  public Node<K,V> left;
  public Node<K,V> right;
}

class BinaryTreeTests extends Tests
{
  public static void run()
  {
    log("Testing BinaryTree");
    testBinaryTree();
    log("Passed BinaryTree Tests!");
  }

  public static void testBinaryTree()
  {
    testInsert();
    testFind();
    testRemove();
  }

  public static void testInsert()
  {
    log("Testing BinaryTree#insert(key, value)");
    BinaryTree<Integer,String> tree = new BinaryTree();

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

  public static BinaryTree<Integer, String> setup()
  {
    BinaryTree<Integer,String> tree = new BinaryTree();

    tree.insert(1, "Alice");
    tree.insert(2, "Bob");
    tree.insert(3, "Carol");
    tree.insert(4, "David");
    tree.insert(5, "Eve");

    return tree;
  }

  public static void testFind()
  {
    BinaryTree<Integer, String> tree = setup();

    log("Testing BinaryTree#find(key)");
    if (tree.find(3).value != "Carol")
      throw new Error("Tree.find() should find node with given key");

    log("Testing BinaryTree#findMin()");
    if (tree.findMin().value != "Alice")
      throw new Error("Tree.FindMin() should find node with smallest key");

    log("Testing BinaryTree#findMin()");
    if (tree.findMax().value != "Eve")
      throw new Error("Tree.findMax() should find node with largest key");
  }

  public static void testRemove()
  {
    log("Testing BinaryTree#remove(key)");
    BinaryTree<Integer, String> tree = setup();

    Node<Integer,String> before = tree.find(3);
    Node<Integer,String> root = tree.remove(3);
    Node<Integer,String> after = tree.find(3);

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
      BinaryTreeTests.run();
    }
    catch (Error e)
    {
      log(e.toString());
      System.exit(1);
    }
  }
}
