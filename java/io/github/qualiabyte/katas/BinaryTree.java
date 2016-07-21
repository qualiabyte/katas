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
      // Replace existing node
      current = replace(node, current);
    }
    return current;
  }

  public Node<K,V> replace(Node<K,V> node, Node<K,V> current)
  {
    node.left = current.left;
    node.right = current.right;
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

  public String toString()
  {
    String result = "BinaryTree:\n";
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
    testAddNode();
  }

  public static void testAddNode()
  {
    log("Testing BinaryTree#add(key, value)");
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
