{-# LANGUAGE OverloadedStrings #-}

module Assert (assert) where

import Data.String
import Rainbow

-- Asserts condition is true, or fail with message.
assert :: Bool -> String -> IO ()
assert condition message
  | condition == True = pass passed
  | otherwise         = fail failed
  where passed = "✔ " ++ message
        failed = "❌ " ++ message
        pass msg = do putChunkLn $ ((fromString msg :: Chunk) <> (Rainbow.fore green))
        fail msg = do putChunkLn $ ((fromString msg :: Chunk) <> (Rainbow.fore red))
                      error "Failed assertion"
