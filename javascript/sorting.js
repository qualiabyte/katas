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
  },

  swap: (a, i, j) =>
  {
    let tmp = a[i]
    a[i] = a[j]
    a[j] = a[i]
  },

  // Shellsort
  // Heapsort
  // Mergesort
  // Quicksort
  quicksort: (a) =>
  {
    // Return trivial arrays
    if (a.length <= 1)
      return a

    // Choose sample of three elements
    let leftPos = 0
    let middlePos = Math.floor(a.length / 2)
    let rightPos = a.length - 1
    let left = a[leftPos]
    let middle = a[middlePos]
    let right = a[rightPos]
    let sample = [left, middle, right]

    // Sort the sample
    if (sample[0] > sample[1]) Sorting.swap(sample, 0, 1)
    if (sample[1] > sample[2]) Sorting.swap(sample, 1, 2)

    // Select the median
    let median = sample[1]
    let medianPos = median == left ? leftPos
      : median == middle ? middlePos
      : rightPos

    // Set the pivot
    let pivot = median
    let pivotPos = medianPos

    // Remove the pivot
    a.splice(pivotPos, 1)

    // Partition the array
    let leftArray = a.filter((item) => item <= pivot)
    let rightArray = a.filter((item) => item > pivot)

    // Sort the partitions
    leftArray = Sorting.quicksort(leftArray)
    rightArray = Sorting.quicksort(rightArray)

    // Fill original array with sorted results
    a.splice(0, a.length, ...leftArray, pivot, ...rightArray)

    // Return the sorted array
    return a
  }
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
      'insertionSort',
      'quicksort'
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
