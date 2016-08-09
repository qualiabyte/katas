#include <cassert>
#include <iostream>
#include <string>

namespace Katas {

using namespace std;

template<class K, class V, class F> class Hash;
template<class K, class V> class HashItem;

class HashFunction
{
public:
  int operator()(string s, int tableSize)
  {
    int hashValue = 0;

    for (int i = 0; i < s.length(); i++)
      hashValue = 37 * hashValue + s[i];

    hashValue %= tableSize;

    if (hashValue < 0)
      hashValue += tableSize;

    return hashValue;
  }

  int operator()(int i, int tableSize)
  {
    int hashValue = i % tableSize;
    if (hashValue < 0)
      hashValue += tableSize;

    return hashValue;
  }
};


template<class K, class V>
class HashItem
{
public:
  HashItem(K key, V value)
  {
    this->key = key;
    this->value = value;
  }

  ~HashItem()
  {}

  K key;
  V value;
};

template<typename K = string, typename V = string, typename F = HashFunction>
class Hash
{
public:
  // Constructs a new hash instance.
  Hash()
  {
    init();
  }

  // Constructs a new hash of given size.
  Hash(int _tableSize)
  {
    tableSize = nextPrime(_tableSize - 1);
    init();
  }

  // Initialises the hash.
  void init()
  {
    table = new HashItem<K,V>*[tableSize]();
  }

  // Deletes the hash.
  ~Hash()
  {
    delete[] table;
    table = NULL;
  }

  // Gets reference to stored value by key.
  V* get(K key)
  {
    int hash = hashFunction(key, tableSize);
    auto item = find(key, hash);
    auto value = item ? & item->value : NULL;
    return value;
  }

  // Finds item with key by probing from hash position.
  HashItem<K,V>* find(K key, int hash)
  {
    auto item = table[hash];
    for (int i = 0; item && item->key != key; i++)
    {
      item = table[hash + i*i];
    }
    return item && item->key == key ? item : NULL;
  }

  // Puts hash item with given key and value.
  void put(K key, V val)
  {
    // Create new hash item
    auto item = new HashItem<K,V>(key, val);
    auto hash = hashFunction(key, tableSize);
    auto position = nextPosition(hash);

    // Insert item into table
    table[position] = item;
    totalCells++;

    // Rehash if necessary
    if (totalCells >= tableSize / 2)
      rehash();
  }

  // Finds next free table cell using quadratic probing.
  int nextPosition(int start)
  {
    int i = 0;
    int position = start % tableSize;
    while (table[position] != NULL)
    {
      i++;
      position = (start + i*i) % tableSize;
    }
    return position;
  }

  // Rehashes table size to the next prime at least twice as large.
  void rehash()
  {
    int oldSize = tableSize;
    int newSize = nextPrime(2 * tableSize);
    auto oldTable = table;
    auto newTable = new HashItem<K,V>*[newSize]();

    // Move items into new hash table
    for (int i = 0; i < oldSize; i++)
    {
      if (auto cell = oldTable[i])
      {
        auto item = cell;
        int hashValue = hashFunction(item->key, newSize);
        newTable[hashValue] = item;
      }
    }

    // Log rehash event
    cout << "REHASH " << oldSize << " -> " << newSize << endl;

    delete[] oldTable;
    this->table = newTable;
    this->tableSize = newSize;
  }

  // Finds the next prime beyond a given value.
  int nextPrime(int previous)
  {
    bool even = previous % 2 == 0;
    int next = even ? previous + 1 : previous + 2;
    while (!isPrime(next))
      next += 2;
    return next;
  }

  // Checks whether given number is prime.
  bool isPrime(const int number)
  {
    if (number % 2 == 0) return false;
    for (int i = 3; i <= number / i; i += 2)
    {
      int remainder = number % i;
      if (remainder == 0)
      {
        return false;
      }
    }
    return true;
  }

  F hashFunction;
  HashItem<K,V>** table;
  int tableSize = DEFAULT_TABLE_SIZE;
  int totalCells = 0;
  static const int DEFAULT_TABLE_SIZE = 11;
};

} // Katas
