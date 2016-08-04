package io.github.qualiabyte.katas;

public class Log
{
  public static boolean DEBUG = false;
  public static void debug(String s)
  {
    if (DEBUG)
      System.out.println(s);
  }
}
