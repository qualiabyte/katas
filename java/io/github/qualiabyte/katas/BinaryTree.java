package io.github.qualiabyte.katas;

public class BinaryTree<K extends Comparable,V>
{
  public BinaryTree()
  {
    root = null;
  }

  public Node<K,V> insert(K key, V value)
  {
    Node<K,V> node = new Node(key, value);
    root = insert(node, root);
    return node;
  }

  public Node<K,V> insert(Node<K,V> node, Node<K,V> current)
  {
    if (current == null)
    {
      // Leaf node
      current = node;
    }
    else if (node.key.compareTo(current.key) < 0)
    {
      // Insert left branch
      current.left = insert(node, current.left);
    }
    else if (node.key.compareTo(current.key) > 0)
    {
      // Insert right branch
      current.right = insert(node, current.right);
    }
    else
    {
      // Update existing node
      current.key = node.key;
      current.value = node.value;
    }
    return current;
  }

  public Node<K,V> remove(K key)
  {
    return remove(key, root);
  }

  public Node<K,V> remove(K key, Node<K,V> node)
  {
    if (node == null)
    {
      return null;
    }
    else if (key.compareTo(node.key) < 0)
    {
      node.left = remove(key, node.left);
    }
    else if (key.compareTo(node.key) > 0)
    {
      node.right = remove(key, node.right);
    }
    else if (node.left != null && node.right != null)
    {
      Node<K,V> smallest = findMin(node.right);

      node.key = smallest.key;
      node.value = smallest.value;

      node.right = remove(smallest.key, node.right);
    }
    else if (node.left != null)
    {
      node = node.left;
    }
    else if (node.right != null)
    {
      node = node.right;
    }
    return node;
  }

  public Node<K,V> find(K key)
  {
    return find(key, root);
  }

  public Node<K,V> find(K key, Node<K,V> start)
  {
    if (start == null)
    {
      return null;
    }
    else if (key.compareTo(start.key) < 0)
    {
      return find(key, start.left);
    }
    else if (key.compareTo(start.key) > 0)
    {
      return find(key, start.right);
    }
    else
    {
      return start;
    }
  }

  public Node<K,V> findMin()
  {
    return findMin(root);
  }

  public Node<K,V> findMin(Node<K,V> node)
  {
    if (node.left != null)
      return findMin(node.left);
    else
      return node;
  }

  public Node<K,V> findMax()
  {
    return findMax(root);
  }

  public Node<K,V> findMax(Node<K,V> node)
  {
    if (node.right!= null)
      return findMax(node.right);
    else
      return node;
  }

  public String toString()
  {
    String result = "BinaryTree:";
    if (root != null)
    {
      result += root.toString();
    }
    else
    {
      result += "Null";
    }
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
