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
    return Sorting._insertionSort(a, 0, a.length - 1)
  },

  // Insertion sorts the given subarray in place.
  _insertionSort: (a, start, end) =>
  {
    for (let i = start; i < end; i++)
    {
      let next = a[i]
      let smallest = a[i]
      let smallestPos = i

      for (let j = i + 1; j <= end; j++)
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

  // Shellsort
  // Heapsort
  // Mergesort

  // Quicksorts the given array in place.
  quicksort: (a) =>
  {
    let result = Sorting._quicksort(a, 0, a.length - 1)
    return a
  },

  // Quicksorts the given subarray in place.
  _quicksort: (a, left, right) =>
  {
    // Use insertion sort for small arrays
    let length = 1 + right - left
    if (length <= 3)
      return Sorting._insertionSort(a, left, right)

    // Set the pivot
    let pivot = Sorting.medianOfThree(a, left, right)
    let p = Math.floor(left + length / 2)

    // Move pivot to next to last position
    Sorting.swap(a, p, right - 1)

    // Initialise the partion boundaries
    let i = 0
    let j = right - 1

    // Partition the array
    for ( ; ; )
    {
      while (a[++i] < pivot) {}
      while (a[--j] > pivot) {}

      if (i < j)
        Sorting.swap(a, i, j)
      else
        break
    }

    // Restore the pivot
    Sorting.swap(a, i, right - 1)

    // Sort the left and right subarrays
    Sorting._quicksort(a, left, i - 1)
    Sorting._quicksort(a, i + 1, right)

    // Return the sorted array
    return a
  },

  // Swaps array values at given indices.
  swap: (a, i, j) =>
  {
    let tmp = a[i]
    a[i] = a[j]
    a[j] = tmp
  },

  // Estimates the subarray median by sorting left, right, and center.
  medianOfThree: (array, left, right) =>
  {
    let length = 1 + right - left
    let middle = Math.floor(left + length / 2)

    if (array[left] > array[right]) Sorting.swap(array, left, right)
    if (array[left] > array[middle]) Sorting.swap(array, left, middle)
    if (array[middle] > array[right]) Sorting.swap(array, middle, right)

    let median = array[middle]
    return median
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
