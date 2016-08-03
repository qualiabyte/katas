
#include <string>
#include <iostream>

int main(int argc, char** argv)
{
  std::cout << "Hello world!" << std::endl;
  std::cout << "Arguments: ";
  for (int i = 1; i < argc; i++)
  {
    std::string argument = argv[i];
    std::string suffix = i < argc - 1 ? ", " : "";
    std::cout << argument << suffix;
  }
  std::cout << std::endl;
}
