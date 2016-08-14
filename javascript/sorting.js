'use strict'

let log = function()
{
  console.log.apply(this, arguments)
}

let Sorting =
{
  // Default Sort
  defaultSort: (a) =>
  {
    return a.sort()
  },

  // Insertion Sort
  insertionSort: (a) =>
  {
    for (let i = 0; i < a.length; i++)
    {
      let next = a[i]
      let smallest = a[i]
      let smallestPos = i

      for (let j = i; j < a.length; j++)
      {
        if (a[j] < smallest)
        {
          smallest = a[j]
          smallestPos = j
        }
      }

      if (smallestPos != i)
      {
        a[i] = smallest
        a[smallestPos] = next
      }
    }
  }

  // Shellsort
  // Heapsort
  // Mergesort
  // Quicksort
}

// Tests
class Tests
{
  constructor()
  {
  }

  run()
  {
    log("Testing Sorting methods")
    this.testSortMethods([
      'defaultSort',
      'insertionSort'
    ])
    log("Passed Sorting methods!")
  }

  assert(value, message)
  {
    if (!value)
      throw new Error(message)
  }

  log()
  {
    console.log(arguments)
  }

  testSortMethods(names)
  {
    names.forEach((name) =>
      this.testSortBasics(Sorting[name], name))
  }

  testSortBasics(sortMethod, name)
  {
    log(`Testing basics for sorting method ${name}`)
    let array = [ 9, 1, 8, 2, 7, 6, 3, 5, 4 ]
    let expected = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]

    sortMethod(array)

    this.assert(array.length == expected.length, "Length of sorted array should match input array")

    for (let i = 0; i < expected.length; i++)
    {
      this.assert(
        array[i] == expected[i],
        `Sorted element should match expected value (${i}: ${array[i]}, ${expected[i]})`
      )
    }
  }
}

function main()
{
  let tests = new Tests()
  tests.run()
}

main()
