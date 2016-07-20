package io.github.qualiabyte.katas;

public class KataTests extends Tests
{
  public KataTests() {}

  public void run()
  {
    log("Testing Katas");
    Tests stackTests = new StackTests();
    stackTests.run();
    log("Passed Kata Tests!");
  }

  public void log(String message)
  {
    System.out.println(message);
  }

  public static void main(String[] args)
  {
    Tests tests = new KataTests();
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
