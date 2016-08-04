package io.github.qualiabyte.katas;

interface HashFunction
{
  public static int hash(String s, int tableSize)
  {
    return s.hashCode() % tableSize;
  }
}

public class Hash implements HashFunction
{
  public Hash()
  {
    table = new HashNode[ tableSize ];
  }

  public HashNode get(String key)
  {
    Log.debug("GET " + key);
    HashNode list = lookup(key);
    HashNode node = null;

    if (list != null)
      node = list.find(key);

    return node;
  }

  public HashNode lookup(String key)
  {
    int hash = SimpleHash.hash(key, tableSize);
    HashNode head = table[hash];
    return head;
  }

  public HashNode put(String key, Object value)
  {
    Log.debug("PUT " + key + " " + value);
    HashNode node = new HashNode(key, value);
    HashNode list = lookup(key);
    HashNode current = list != null ? list.find(key) : null;

    int hash = node.hash(tableSize);

    if (list == null)
    {
      // Create new list
      list = node;
      table[hash] = list;
      count++;
    }
    else if (current == null)
    {
      // Prepend to list
      HashNode head = list;

      node.next = head;
      head.prev = node;

      table[hash] = node;
      count++;
    }
    else
    {
      // Replace within list
      HashNode next = current.next;
      HashNode prev = current.prev;

      if (next != null)
        next.prev = node;

      if (prev != null)
        prev.next = node;

      node.next = next;
      node.prev = prev;
    }
    return node;
  }

  public HashNode delete(String key)
  {
    Log.debug("DELETE " + key);
    HashNode node = get(key);
    if (node == null)
    {
      return null;
    }
    else
    {
      HashNode prev = node.prev;
      HashNode next = node.next;

      // Update nodes
      if (next != null)
        next.prev = prev;

      if (prev != null)
        prev.next = next;

      // Update table
      if (prev == null)
      {
        int hash = node.hash(tableSize);
        table[hash] = next;
      }

      count--;
      return node;
    }
  }

  public String toString()
  {
    String result = "Hash: ";
    result += count + ", ";
    result += tableSize;
    return result;
  }

  public static int hash(String s, int tableSize)
  {
    return SimpleHash.hash(s, tableSize);
  }

  public int count;
  public int tableSize = 10007;
  public HashNode[] table;
}

class SimpleHash implements HashFunction
{
  public static int hash(String s, int tableSize)
  {
    int hashValue = 0;

    for (int i = 0; i < s.length(); i++)
      hashValue += 37 * hashValue + s.charAt(i);

    hashValue %= tableSize;

    if (hashValue < 0)
      hashValue += tableSize;

    return hashValue;
  }
}

interface Hashable
{
  public int hash(int tableSize);
}

class HashNode implements Hashable
{
  public HashNode(String key, Object value)
  {
    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
  }

  public HashNode find(String key)
  {
    HashNode node = this;
    while (node != null)
    {
      if (node.key == key) break;
      node = node.next;
    }
    return node;
  }

  public int hash(int tableSize)
  {
    return SimpleHash.hash(key, tableSize);
  }

  public String toString()
  {
    String result = "HashNode: ";
    result += key + ", ";
    result += value + ", ";
    result += hash(10007);
    return result;
  }

  public String key;
  public Object value;
  public HashNode next;
  public HashNode prev;
}

class HashTests extends Tests
{
  public static void run()
  {
    log("Testing Hash");
    testHash();
    log("Passed Hash Tests!");
  }

  public static void testHash()
  {
    testPut();
    testGet();
    testDelete();
  }

  public static void testPut()
  {
    log("Testing Hash#put(key, value)");
    Hash hash = new Hash();

    hash.put("Alice", 1);
    hash.put("Bob", 2);
    hash.put("Carol", 3);
    hash.put("David", 4);
    hash.put("Eve", 5);

    log(hash.toString());

    if ((Integer)hash.get("Alice").value != 1)
      throw new Error("Hash.put() should add first entry");

    if ((Integer)hash.get("Bob").value != 2)
      throw new Error("Hash.put() should add second entry");

    if ((Integer)hash.get("Carol").value != 3)
      throw new Error("Hash.put() should add third entry");

    if ((Integer)hash.get("David").value != 4)
      throw new Error("Hash.put() should add fourth entry");

    if ((Integer)hash.get("Eve").value != 5)
      throw new Error("Hash.put() should add fifth entry");
  }

  public static Hash setup()
  {
    Hash hash = new Hash();

    hash.put("Alice", 1);
    hash.put("Bob", 2);
    hash.put("Carol", 3);
    hash.put("David", 4);
    hash.put("Eve", 5);

    return hash;
  }

  public static void testGet()
  {
    log("Testing Hash#get(key)");

    Hash hash = setup();

    if ((Integer)hash.get("Carol").value != 3)
      throw new Error("Hash.get() should return node with given key");

    if ((Integer)hash.get("Alice").value != 1)
      throw new Error("Hash.get() should return node with given key");

    if ((Integer)hash.get("Eve").value != 5)
      throw new Error("Hash.get() should return node with given key");
  }

  public static void testDelete()
  {
    log("Testing Hash#delete(key)");
    Hash hash = setup();

    Integer before  = (Integer) hash.get("Carol").value;
    Integer removed = (Integer) hash.delete("Carol").value;
    HashNode after  = hash.get("Carol");

    log(hash.toString());

    if (before == null)
      throw new Error("Item should exist in hash before removal");

    if (after != null)
      throw new Error("Hash.delete() should remove item with given key");

    if (before != removed)
      throw new Error("Hash.delete() should return the item");
  }

  public static void main(String[] args)
  {
    try
    {
      HashTests.run();
    }
    catch (Error e)
    {
      log(e.toString());
      System.exit(1);
    }
  }
}
