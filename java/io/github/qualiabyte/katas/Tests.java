package io.github.qualiabyte.katas;

public class Tests
{
  public Tests() {}

  public void run() {}

  public void log(String message)
  {
    System.out.println(message);
  }

  public static void main(String[] args)
  {
    Tests tests = (Tests) new KataTests();
    try
    {
      tests.run();
    }
    catch (Error e)
    {
      System.exit(1);
    }
  }
}
