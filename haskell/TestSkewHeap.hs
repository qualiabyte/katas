
module TestSkewHeap where

import Assert
import SkewHeap

testToHeap = do
  putStrLn "Testing ToHeap..."
  let heap = toHeap 42
  let Just (value, h2) = extractMin heap
  assert (value == 42) "The heap should return the initial value"

testHeapify = do
  putStrLn "Testing Heapify..."
  let list = [ 9, 2, 7, 4, 5, 6, 3, 8, 1 ]
  let heap = heapify list
  let Just (value, h2) = extractMin heap
  assert (value == 1) "The heap should return the smallest value"

testSkewHeap = do
  putStrLn "Testing SkewHeap..."
  let heap = SkewNode 3 Empty Empty
  assert (heap == SkewNode 3 Empty Empty) "The heap should contain a single value"

test :: IO ()
test = do
  putStrLn "Testing Heap..."
  testToHeap
  testHeapify
  testSkewHeap
  putStrLn "Passed All Tests!"

main :: IO ()
main = do
  test
