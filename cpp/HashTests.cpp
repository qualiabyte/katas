#include <cassert>
#include <iostream>
#include <string>

#include "Hash.cpp"
#include "Pokemon.cpp"

namespace Katas {
namespace Tests {

using namespace std;
using namespace Katas::Pokemon;

void testHashInsertSingle()
{
  cout << "Testing Hash Insert Single..." << endl;
  auto hash = new Hash<string,Species,HashFunction>();

  hash->put(POKEMON[BULBASAUR].name, POKEMON[BULBASAUR]);

  auto bulbasaur = *hash->get("Bulbasaur");

  assert(bulbasaur.id == 1);
  assert(bulbasaur.name == "Bulbasaur");
  assert(bulbasaur.type1 == "Grass");
  assert(bulbasaur.type2 == "Poison");

  cout << "bulbasaur.id: " << bulbasaur.id << endl;
  cout << "bulbasaur.name: " << bulbasaur.name << endl;
  cout << "bulbasaur.type1: " << bulbasaur.type1 << endl;
  cout << "bulbasaur.type2: " << bulbasaur.type2 << endl;

  delete hash;
}

void testHashInsertPrimitive()
{
  cout << "Testing Hash Insert Primitive..." << endl;
  auto hash = new Hash<int,Species>();

  for (int i = 1; i <= 9; i++)
    hash->put(POKEMON[i].id, POKEMON[i]);

  auto venusaur = *hash->get(VENUSAUR);

  assert(venusaur.id == 3);
  assert(venusaur.name == "Venusaur");
  assert(venusaur.type1 == "Grass");
  assert(venusaur.type2 == "Poison");

  cout << "venusaur.id: " << venusaur.id << endl;
  cout << "venusaur.name: " << venusaur.name << endl;
  cout << "venusaur.type1: " << venusaur.type1 << endl;
  cout << "venusaur.type2: " << venusaur.type2 << endl;

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
  testHashInsertPrimitive();
  testHashInsert();
  cout << "Passed Hash Tests!" << endl;
}

} // Katas::Tests
} // Katas

int main(int argc, char** argv)
{
  Katas::Tests::testHash();
}
