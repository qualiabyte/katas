package io.github.qualiabyte.katas;

public class Tests
{
  public static void run()
  {
    KataTests.run();
  }

  public static void log(String message)
  {
    System.out.println(message);
  }

  public static void main(String[] args)
  {
    try
    {
      Tests.run();
    }
    catch (Error e)
    {
      log(e.toString());
      System.exit(1);
    }
  }
}
