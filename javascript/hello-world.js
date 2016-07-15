'use strict'

// ES5 Functions
function main() {
  console.log(`Hello, world! (ES5)`)
}
main()


// ES6 Arrows
let speak = () => {
  console.log(`Hello, world! (ES6 Arrow)`)
}
speak()


// ES6 Classes
class HelloWorld {
  static greet() {
    console.log(`Hello, world! (ES6 classes)`)
  }
}
HelloWorld.greet()

// ES6 Objects
class Greeter {
  constructor(greeting, name) {
    this.greeting = greeting
    this.name = name
  }
  greet() {
    console.log(`${this.greeting}, ${this.name}! (ES6 Objects)`)
  }
}
let greeter = new Greeter("コニチワ", "シンジークン")
greeter.greet('')
