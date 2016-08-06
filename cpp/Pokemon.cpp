
#include <string>

namespace Katas {
namespace Pokemon {

using namespace std;

enum POKEMON_ID
{
  BULBASAUR = 1,
  IVYSAUR,
  VENUSAUR,
  CHARMANDER,
  CHARMELEON,
  CHARIZARD,
  SQUIRTLE,
  BLASTOISE,
  WARTORTLE
};

struct Species
{
  int id;
  string name;
  string type1;
  string type2;
};

struct Pokemon
{
  Species* species;
  string name;
  int cp;
  int hp;
};

Species POKEMON[]
{
  { 0, "", "", "" },
  { 1, "Bulbasaur", "Grass", "Poison" },
  { 2, "Ivysaur", "Grass", "Poison" },
  { 3, "Venusaur", "Grass", "Poison" },
  { 4, "Charmander", "Fire", "" },
  { 5, "Charmeleon", "Fire", "" },
  { 6, "Charizard", "Fire", "Flying" },
  { 7, "Squirtle", "Water", "" },
  { 8, "Wartortle", "Water", "" },
  { 9, "Blastoise", "Water", "" },
};


} // Katas::Pokemon
} // Katas
