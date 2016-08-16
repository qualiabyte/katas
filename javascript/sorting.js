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

  // Quicksort
  quicksort: (a) =>
  {
    // Use insertion sort for small arrays
    if (a.length <= 10)
      return Sorting.insertionSort(a)

    // Set the pivot
    let pivot = Sorting.medianOfThree(a)
    let pivotPos = Math.floor(a.length / 2)

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
  },

  // Swaps array values at given indices.
  swap: (a, i, j) =>
  {
    let tmp = a[i]
    a[i] = a[j]
    a[j] = tmp
  },

  // Estimates the array median by sorting left, right, and center.
  medianOfThree: (array) =>
  {
    let left = 0
    let middle = Math.floor(array.length / 2)
    let right = array.length - 1

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
