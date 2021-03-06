package io.github.qualiabyte.katas;

public class Stack<T>
{
  Stack(int maxHeight)
  {
    max = maxHeight;
    elements = (T[]) new Object[max];
    height = 0;
  }

  T push(T value)
  {
    height++;
    elements[height-1] = value;
    return value;
  }

  T pop()
  {
    if (height > 0)
    {
      T element = elements[height-1];
      height--;
      return element;
    }
    else
      throw new Error("Failed popping empty stack");
  }

  T top()
  {
    return (height > 0) ? elements[height-1] : null;
  }

  T[] elements;
  int height;
  int max;
}

class StackTests extends Tests
{
  public static void run()
  {
    testStack();
  }

  public static void testStack()
  {
    log("Testing Stack class");
    testPush();
    testProperties();
    testPop();
    testTop();
    log("Passed Stack tests!");
  }

  public static Stack<String> setup()
  {
    Stack<String> stack = new Stack(256);

    stack.push("Hello");
    stack.push(", ");
    stack.push("World");
    stack.push("!");

    return stack;
  }

  public static void testPush()
  {
    log("Testing stack.push()");
    Stack<String> stack = new Stack(256);

    stack.push("Hello");
    stack.push(", ");
    stack.push("World");

    if (stack.height != 3 || stack.top() != "World")
      throw new Error("Stack.push() should add values to the stack");
  }

  public static void testProperties()
  {
    log("Testing stack properties");
    Stack<String> stack = setup();

    if (stack.height != 4)
      throw new Error("Stack height should increase with new elements");

    if (stack.max != 256)
      throw new Error("Stack maximum should match constructor value");
  }

  public static void testTop()
  {
    log("Testing stack.top()");
    Stack<String> stack = setup();

    if (stack.top() != "!")
      throw new Error("Stack top should equal most recent value");
  }

  public static void testPop()
  {
    log("Testing stack.pop()");
    Stack<String> stack = setup();

    stack.pop();

    if (stack.height != 3)
      throw new Error("Stack.pop() should decrement the height");

    if (stack.top() != "World")
      throw new Error("Stack.pop() should remove the last value");

    String last = stack.pop();

    if (last != "World")
      throw new Error("Stack.pop() should return the popped value");
  }

  public static void main(String[] args)
  {
    try
    {
      StackTests.run();
    }
    catch (Error e)
    {
      System.exit(1);
    }
  }
}
