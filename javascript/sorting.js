'use strict'

let log = function()
{
  console.log.apply(this, arguments)
}

let Sorting =
{
  // Compares given elements numerically.
  compare: (a, b) =>
  {
    return a - b
  },

  // Swaps array values at given indices.
  swap: (a, i, j) =>
  {
    let tmp = a[i]
    a[i] = a[j]
    a[j] = tmp
  },

  // Sorts the given array in place, using the default sort method.
  defaultSort: (a, compare) =>
  {
    compare = compare || Sorting.compare
    return a.sort(compare)
  },

  // Insertion sorts the given array in place.
  insertionSort: (a, compare=Sorting.compare) =>
  {
    Sorting._insertionSort(a, 0, a.length - 1, compare)
    return a
  },

  // Mergesorts the given array in place.
  mergesort: (a) =>
  {
    let temp = []
    Sorting._mergesort(a, 0, a.length - 1, temp)
    return a
  },

  // Quicksorts the given array in place, optimized for simplicity.
  simpleQuicksort: (a) =>
  {
    Sorting._quicksort2(a, 0, a.length - 1)
    return a
  },

  // Quicksorts the given array in place.
  quicksort: (a, compare=Sorting.compare) =>
  {
    Sorting._quicksort(a, 0, a.length - 1, compare)
    return a
  },

  // Insertion sorts the given subarray in place.
  _insertionSort: (a, start, end, compare) =>
  {
    for (let i = start; i < end; i++)
    {
      let next = a[i]
      let smallest = a[i]
      let smallestPos = i

      for (let j = i + 1; j <= end; j++)
      {
        if (compare(a[j], smallest) < 0)
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

  heapsort: (a) =>
  {
    Sorting._heapsort(a)
    return a
  },

  _heapsort: (a) =>
  {
    // Build heap
    let heap = Sorting._buildHeap(a)

    // Extract sorted values
    for (let i = 0; i < a.length; i++)
    {
      a[i] = Sorting._heapDeleteMin(heap)
    }
  },

  _buildHeap: (a) =>
  {
    let heap = []
    for (let item of a)
    {
      Sorting._heapInsert(heap, item)
    }
    return heap
  },

  _heapMin: (heap) =>
  {
    return heap[1]
  },

  _heapDeleteMin: (heap, node=1) =>
  {
    let min = Sorting._heapDelete(heap, node)
    return min
  },

  _heapDelete: (heap, node) =>
  {
    let value = heap[node]
    let left = 2 * node
    let right = 2 * node + 1
    if (heap[node] == null)
    {
      return null
    }
    else if (heap[left] == null && heap[right] == null)
    {
      heap[node] = null
    }
    else if (heap[right] == null)
    {
      heap[node] = heap[left]
      Sorting._heapDeleteMin(heap, left)
    }
    else if (heap[left] == null)
    {
      heap[node] = heap[right]
      Sorting._heapDeleteMin(heap, right)
    }
    else if (heap[left] < heap[right])
    {
      heap[node] = heap[left]
      Sorting._heapDeleteMin(heap, left)
    }
    else
    {
      heap[node] = heap[right]
      Sorting._heapDeleteMin(heap, right)
    }
    return value
  },

  _heapInsert: (heap, item, root=1) =>
  {
    let left = 2 * root
    let right = 2 * root + 1

    // Swap if item smaller than root
    if (heap[root] != null && heap[root] > item)
    {
      let temp = heap[root]
      heap[root] = item
      item = temp
    }

    // Insert item into root node
    if (heap[root] == null)
    {
      heap[root] = item
    }
    else if (heap[left] == null)
    {
      heap[left] = item
    }
    else if (heap[right] == null)
    {
      heap[right] = item
    }
    else if (heap[left] != null && heap[right] != null)
    {
      Sorting._heapInsert(heap, item, Math.random() < 0.5 ? left : right)
    }
  },

  // Merges the given partitioned subarray in place.
  _merge: (a, left, center, right, temp) =>
  {
    let length = right - left + 1

    // Merge the sorted subarrays
    for (let i = 0, p1 = left, p2 = center + 1; i < length; i++)
    {
      if (p2 > right || p1 <= center && a[p1] < a[p2])
        temp[left + i] = a[p1++]
      else
        temp[left + i] = a[p2++]
    }

    // Fill subarray with merged values
    for (let i = 0; i < length; i++)
    {
      a[left + i] = temp[left + i]
    }
  },

  // Mergesorts the given subarray in place.
  _mergesort: (a, left, right, temp) =>
  {
    if (left < right)
    {
      let center = Math.floor(left + (right - left) / 2)
      Sorting._mergesort(a, left, center, temp)
      Sorting._mergesort(a, center + 1, right, temp)
      Sorting._merge(a, left, center, right, temp)
    }
  },

  // Estimates the subarray median by sorting left, right, and center.
  _medianOfThree: (array, left, right, compare=Sorting.compare) =>
  {
    let length = 1 + right - left
    let middle = Math.floor(left + length / 2)

    if (compare(array[left], array[right]) > 0) Sorting.swap(array, left, right)
    if (compare(array[left], array[middle]) > 0) Sorting.swap(array, left, middle)
    if (compare(array[middle], array[right]) > 0) Sorting.swap(array, middle, right)

    let median = array[middle]
    return median
  },

  // Quicksorts the given subarray in place.
  _quicksort: (a, left, right, compare=Sorting.compare) =>
  {
    // Use insertion sort for small arrays
    let length = 1 + right - left
    if (length <= 20)
      return Sorting._insertionSort(a, left, right, compare)

    // Set the pivot
    let pivot = Sorting._medianOfThree(a, left, right, compare)
    let p = Math.floor(left + length / 2)

    // Move pivot to next to last position
    Sorting.swap(a, p, right - 1)

    // Initialise the partion boundaries
    let i = left
    let j = right - 1

    // Partition the array
    for ( ; ; )
    {
      while (compare(a[++i], pivot) < 0) {}
      while (compare(a[--j], pivot) > 0) {}

      if (i < j)
        Sorting.swap(a, i, j)
      else
        break
    }

    // Restore the pivot
    Sorting.swap(a, i, right - 1)

    // Sort the left and right subarrays
    Sorting._quicksort(a, left, i - 1, compare)
    Sorting._quicksort(a, i + 1, right, compare)
  },

  // Quicksorts the given subarray in place, optimized for simplicity.
  _quicksort2: (a, left, right) =>
  {
    if (right <= left) return
    let p = Math.floor(left + (right - left)/2)
    let pivot = a[p]
    let i = left
    let j = right

    while (true)
    {
      while (a[i] < pivot) { i++ }
      while (a[j] > pivot) { j-- }

      if (i < j)
        Sorting.swap(a, i, j)
      else
        break
    }

    Sorting._quicksort2(a, left, i - 1)
    Sorting._quicksort2(a, i + 1, right)
  },
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
      'heapsort',
      'mergesort',
      'quicksort',
      'simpleQuicksort',
    ])

    this.testSortPerformance([
      'defaultSort',
      'heapsort',
      'mergesort',
      'quicksort',
      'simpleQuicksort',
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
    names.forEach((name) => {
      this.testSortBasics(Sorting[name], name)
    })
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

  testSortPerformance(names)
  {
    let results = []
    for (let n in names)
    {
      let name = names[n]
      let method = Sorting[name]
      let result = this.testSortPerformanceFor(method, name)
      results.push(result)
    }
    for (let result of results)
    {
      let benchmarks = result
      log(`\nResults for ${benchmarks[0].name}`)
      for (let benchmark of benchmarks)
      {
        let name = benchmark.name
        let size = (benchmark.size + "        ").slice(0, 8)
        let time = benchmark.time + "s"
        log(`${name} ${size} ${time}`)
      }
    }
  }

  testSortPerformanceFor(method, name)
  {
    log(`Testing performance for ${name}`)

    let benchmarks = [ 101, 10E3, 100E3, 1E6 ]
    let results = []

    for (let b in benchmarks)
    {
      let N = benchmarks[b]
      let result =
      {
        name: name,
        size: N,
        time: Infinity
      }

      // Fill test array with sequential values
      let array = []
      for (let i = 0; i < N; i++)
      {
        array.push(i)
      }

      // Copy sorted array
      let expected = array.slice(0, array.length)

      // Shuffle test data
      for (let i = 0; i < N; i++)
      {
        let r1 = i
        let r2 = Math.floor(N * Math.random())
        Sorting.swap(array, r1, r2)
      }

      // Perform the benchmark
      let t0 = Date.now()

      method(array)

      let t1 = Date.now()
      let timeDelta = (t1 - t0) / 1000.0

      // Check the sorted length
      this.assert(
        array.length == expected.length,
        "Length of sorted array should match input array"
      )

      // Check the sorted values
      for (let i = 0; i < expected.length; i++)
      {
        this.assert(
          array[i] == expected[i],
          `Sorted element should match expected value (${i}: ${array[i]}, ${expected[i]})`
        )
      }

      // Update the result
      result.time = timeDelta

      // Add result to benchmark data
      results.push(result)
    }
    return results
  }
}

function main()
{
  let tests = new Tests()
  tests.run()
}

main()
