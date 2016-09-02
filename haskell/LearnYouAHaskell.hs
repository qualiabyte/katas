
import Assert

-- Chapter 4: Syntax in Functions

-- Chapter 4.1: Pattern Matching

-- Factorial
factorial :: (Integral a) => a -> a
factorial 0 = 1
factorial n = n * factorial (n - 1)

testFactorial = do
  assert ((factorial 0) == 1) "Factorial of zero should be one"
  assert ((factorial 2) == 2) "Factorial of two should be two"
  assert ((factorial 3) == 6) "Factorial of three should be six"

testChapter4 = do
  putStrLn "Running Chapter 4 tests..."
  testFactorial
  putStrLn "Finished Chapter 4 tests..."

-- Chapter 6: Recursion

-- Finds the maximum value in a list.
maximum' :: (Ord a) => [a] -> a
maximum' [] = error "maximum of empty list"
maximum' [x] = x
maximum' (x:xs)
    | x > maxTail = x
    | otherwise = maxTail
    where maxTail = maximum' xs

-- Replicates an item `n` times.
replicate' :: (Num i, Ord i) => i -> a -> [a]
replicate' n x
    | n <= 0    = []
    | otherwise = x:replicate' (n-1) x

-- Takes first `n` items from a list.
take' :: (Num i, Ord i) => i -> [a] -> [a]
take' n _
    | n <= 0   = []
take' _ []     = []
take' n (x:xs) = x : take' (n-1) xs

testTake = do
  assert ((take 0 [1, 2, 3]) == []) "Should take zero values"
  assert ((take 1 [1, 2, 3]) == [1]) "Should take one value"
  assert ((take 2 [1, 2, 3]) == [1, 2]) "Should take two values"
  assert ((take 3 [1, 2, 3]) == [1, 2, 3]) "Should take three values"

testMaximum = do
  let list = [ 1, 2, 3, 4, 5 ]
  let largest = maximum' list
  assert (largest == 5) "Recursive maximum should select largest from list"

testReplicate = do
  assert ((replicate 0 5) == []) "Replicate should repeat item zero times"
  assert ((replicate 3 5) == [5, 5, 5]) "Replicate should repeat item three times"

testChapter6 = do
  putStrLn "Running Chapter 6 tests..."
  testMaximum
  testReplicate
  testTake
  putStrLn "Finished Chapter 6 tests..."

main = do
  putStrLn "Running Learn You A Haskell tests..."
  testChapter4
  testChapter6
  putStrLn "Passed All Tests!"
