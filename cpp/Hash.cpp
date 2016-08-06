
#include <cassert>
#include <iostream>
#include <string>
#include <vector>

#include "Pokemon.cpp"


namespace Katas {
namespace Hash {


using namespace std;


template<class K, class V> class Hash;
template<class K, class V> class HashItem;


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

  int hash(int tableSize)
  {
    return Hash<K,V>::hashString((string) key, tableSize);
  }

  K key;
  V value;
};


template<class K = string, class V = string>
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
    int hashValue = hashString((string) key, tableSize);
    auto item = findAt(key, hashValue);
    auto value = item ? & item->value : NULL;
    return value;
  }

  // Finds item with key by probing from start position.
  HashItem<K,V>* findAt(K key, int start)
  {
    int i = 0;
    int position = start;
    auto item = table[position];
    bool success = item && item->key == key;
    while (item && !success)
    {
      i++;
      position = start + i * i;
      item = table[position];
      success = item && item->key == key;
    }
    return success ? item : NULL;
  }

  // Puts hash item with given key and value.
  void put(K key, V val)
  {
    // Create new hash item
    auto item = new HashItem<K,V>(key, val);
    auto hash = hashString((string) key, tableSize);
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
        int hashValue = item->hash(newSize);
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

  // Computes hash value for given string and table size.
  static int hashString(string s, int tableSize)
  {
    int hashValue = 0;

    for (int i = 0; i < s.length(); i++)
      hashValue = 37 * hashValue + s[i];

    hashValue %= tableSize;

    if (hashValue < 0)
      hashValue += tableSize;

    return hashValue;
  }

  HashItem<K,V>** table;
  int tableSize = DEFAULT_TABLE_SIZE;
  int totalCells = 0;
  static const int DEFAULT_TABLE_SIZE = 11;
};


namespace Tests {


using namespace Katas::Pokemon;

void testHashInsertSingle()
{
  cout << "Testing Hash Insert Single..." << endl;
  auto hash = new Hash<string,Species>();

  hash->put(POKEMON[BULBASAUR].name, POKEMON[BULBASAUR]);

  auto bulbasaur = *hash->get("Bulbasaur");

  assert(bulbasaur.id == 1);
  assert(bulbasaur.name == "Bulbasaur");
  assert(bulbasaur.type1 == "Grass");
  assert(bulbasaur.type2 == "Poison");

  delete hash;
}

void testHashInsert()
{
  cout << "Testing Hash Insert..." << endl;
  auto hash = new Hash<string,Species>(151);

  for (int i = 1; i <= 9; i++)
    hash->put(POKEMON[i].name, POKEMON[i]);

  auto charizard = *hash->get("Charizard");

  assert(charizard.id == CHARIZARD);
  assert(charizard.name == "Charizard");
  assert(charizard.type1 == "Fire");
  assert(charizard.type2 == "Flying");
  assert(hash->totalCells == 9);
  assert(hash->tableSize == 151);

  delete hash;
}

void testHash()
{
  cout << "Testing Hash" << endl;
  testHashInsertSingle();
  testHashInsert();
  cout << "Passed Hash Tests!" << endl;
}


} // Katas::Hash::Tests
} // Katas::Hash
} // Katas


int main(int argc, char** argv)
{
  Katas::Hash::Tests::testHash();
}
