package io.github.qualiabyte.katas;

public class KataTests extends Tests
{
  public static void run()
  {
    log("Testing Katas");
    StackTests.run();
    log("Passed Kata Tests!");
  }

  public static void main(String[] args)
  {
    try
    {
      KataTests.run();
    }
    catch (Error e)
    {
      System.exit(1);
    }
  }
}
