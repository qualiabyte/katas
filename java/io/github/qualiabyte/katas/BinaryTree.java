package io.github.qualiabyte.katas;

public class BinaryTree<K extends Comparable,V>
{
  public BinaryTree()
  {
    root = null;
  }

  public Node<K,V> add(K key, V value)
  {
    Node<K,V> node = new Node(key, value);
    if (root == null)
    {
      root = node;
    }
    else
    {
      add(node, root);
    }
    return node;
  }

  public Node<K,V> add(Node<K,V> node, Node<K,V> start)
  {
    Node<K,V> parent = start;

    if (node.key.compareTo(parent.key) < 0)
    {
      if (parent.left == null)
      {
        // Create left leaf
        parent.left = node;
        node.parent = parent;
      }
      else
      {
        // Add to left branch
        add(node, parent.left);
      }
    }
    else if (node.key.compareTo(parent.key) > 0)
    {
      if (parent.right == null)
      {
        // Create right leaf
        parent.right = node;
        node.parent = parent;
      }
      else
      {
        // Add to right branch
        add(node, parent.right);
      }
    }
    else
    {
      // Replace node to update key
      node.left = parent.left;
      node.right = parent.right;
      node.parent = parent.parent;

      // Update grandparent
      Node<K,V> grandparent = parent.parent;
      if (grandparent.left == parent)
      {
        grandparent.left = node;
      }
      else
      {
        grandparent.right = node;
      }
    }

    return node;
  }

  public Node<K,V> find(K key)
  {
    return find(key, root);
  }

  public Node<K,V> find(K key, Node<K,V> start)
  {
    Node<K,V> node = null;

    if (start == null)
    {
      node = null;
    }
    else if (key.compareTo(start.key) < 0)
    {
      node = find(key, start.left);
    }
    else if (key.compareTo(start.key) > 0)
    {
      node = find(key, start.right);
    }
    else if (key.compareTo(start.key) == 0)
    {
      node = start;
    }

    return node;
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
    this(key, value, null, null, null);
  }

  public Node(K key, V value, Node parent, Node left, Node right)
  {
    this.key = key;
    this.value = value;
    this.parent = parent;
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
  public Node<K,V> parent;
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

    tree.add(1, "Alice");
    tree.add(2, "Bob");
    tree.add(3, "Carol");
    tree.add(4, "David");
    tree.add(5, "Eve");

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
