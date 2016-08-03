
#include <string>
#include <iostream>

using namespace std;

int main(int argc, char** argv)
{
  cout << "Hello world!" << endl;
  cout << "Arguments: ";
  for (int i = 1; i < argc; i++)
  {
    string argument = argv[i];
    string suffix = i < argc - 1 ? ", " : "";
    cout << argument << suffix;
  }
  cout << endl;
}
