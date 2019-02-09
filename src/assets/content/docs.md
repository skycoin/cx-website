# Introduction

The [CX specification](/App/Specification) describes a set of data structures that define the different elements that a CX program can have, along with a set of functions/methods that manipulate these elements in order to execute a program. But these elements are part of a lower level of abstraction called CX Base. In principle, any language that follows the ideas behind CX Base can be considered a CX dialect.

This tutorial is based on an implementation of CX based on the lexicon, syntax and semantics of [Golang](https://golang.org/). The repository of the whole CX project can be found [here](https://github.com/skycoin/cx). The implementation described in this document can be found under the _src/cxgo/_ directory.

## A compiled and interpreted language

CX is designed to be both a compiled and an interpreted language. You can use the interpreted mode to interactively build and test a program, and when performance is an issue, the source code can be compiled. All of the features that can be used in the interpreted mode are accessible to its compiled counterpart, but it must be noted that CX is still a work in progress and this could change in the future.

## Interactive development

REPL. Add functions, expressions, other elements.

## Meta-programming commands

Meta-programming commands. Selectors. Affordances. Stepping.

## CX's type system

CX supports 13 primitive types:

*   str
*   bool
*   byte
*   i32
*   i64
*   f32
*   f64
*   \[\]bool
*   \[\]byte
*   \[\]i32
*   \[\]i64
*   \[\]f32
*   \[\]f64

In CX there is no type inference or implicit type casting. If a function requires a 32 bit integer, you can't send a 64 integer, or any of the two types of floats. For this reason, the [standard library](#standard-library) provides native functions that consider each of the primitive types when applicable. For example, there are four versions of the addition function: addI32, addI64, addF32, and addF64.

If, for example, you have an _i32_ variable and you want to send it as an argument to a function which only accepts _f64_, you can use one of the casting functions to explicitly cast the variable to _f64_. To see the list of available casting functions, have a look at CX's [standard library](#standard-library) located at the bottom of this document. This is an example of type casting:

```
addF64(i32ToF64(3), f32ToF64(5.4))
```

Character strings in CX need to be enclosed in double quotes, and, unlike other languages such as JavaScript or Go, you can't use single quotes, backquotes or any other enclosing characters. Internally, strings are stored as byte arrays, and one can cast a string to a byte array, and viceversa:

```
byteToStr([]byte{{"{"}}0, 1, 2{{"}"}})
strToByte("hello")
```

Booleans also have a special representation internally: they are actually 32 bit integers, limited to 1 (true) and 0 (false). Nevertheless, booleans can't be casted to numeric types. In CX, booleans are represented by the words _true_ and _false_.

The programmer can create custom types by using CX structs, which are similar to structs in other programming languages. Structs in CX follow the syntax used in Go. Here is an example of a struct declaration:

```
type Point struct {{"{"}}
	name str
	x i32
	y i32
}
```

## CX playground

If you want to try CX programs, you can start doing it right away without downloading the actual interpreter/compiler. In the [home page](/) you can find a tool similar to [Go Playground](https://play.golang.org/), where you can write and evaluate any CX program you want.

## Examples

The full list of examples can be accessed by clicking [here](/App/Examples), but one example is shown below, so you don't have to leave this webpage and for you to check how CX's syntax is like.

```
package main

func main () (out str) {{"{"}}
     printStr("Hello World!")
{{"}"}}
```

# Program architecture

The following sections describe the different elements that can be present in a CX program, and how they interact with each other.

## Comments

There are two kinds of comments in CX: one for commenting out a single line, and another one to comment out a block of lines. As in other programming languages, commented lines are not evaluated by the interpreted or the compiler.

Any sequence of characters after two slashes (//) and until a newline character is found will be commented out, i.e., // comments out a single line.

Any text enclosed between a slash and an asterisk (/\*) and an asterisk and a slash (\*/) will be commented out, i.e., /\* ... \*/ can comment out any number of lines.

```
package main

func main () (out i32) {{"{"}}
	// This won't be evaluated
	//out := divI32(5, 0) // This won't either

	out := divI32(10, 5) // The program will return 2

	/*
        Comment block
	out := subF32(3.33, 1.11)
	out := subF32(3.33, 1.11)
	out := subF32(3.33, 1.11)
	out := subF32(3.33, 1.11)
        */
{{"}"}}
```

## Packages

Packages are a way to create groups of functions and definitions, which don't enter in conflict with other functions and definitions from other packages.

```
package Math

var PI f32 = 3.14159

func Square (num f32) (out f32) {{"{"}}
	mulF32(num, num)
{{"}"}}

package Stat

func Mean (vals []f32) (mean f32) {{"{"}}
	if eqI32(lenF32A(vals), 0) {{"{"}}
		printStr("error?")
		halt("Stat.Mean: division by 0")
	{{"}"}}
	var sum f32 = 0.0
	var counter i32 = 0
	while ltI32(counter, lenF32A(vals)) {{"{"}}
		sum = addF32(sum, readF32A(vals, counter))
		counter = addI32(counter, 1)
	{{"}"}}
	mean = divF32(sum, i32ToF32(lenF32A(vals)))
{{"}"}}

func Variance (vals []f32) (variance f32) {{"{"}}
	mean := Mean(vals)
	var sum f32 = 0.0
	var counter i32 = 0
	while ltI32(counter, lenF32A(vals)) {{"{"}}
		sum = Math.Square(subF32(readF32A(vals, counter), mean))
		counter = addI32(counter, 1)
	{{"}"}}
	variance = divF32(sum, i32ToF32(lenF32A(vals)))
{{"}"}}
        
```

In the example above, two packages are created: one for math functions and definitions (PI and Square), and another for statistical functions (Mean and Variance). Variance calls a function from the Math package: Square. In order to specify that we want to call the function Square from the package Math, we need to use the full name of that function, which is Math.Square in this case. If we wanted to reference to the PI definition in the Math package, we'd use Math.PI.

## Global definitions

Global definitions are variables that are declared, and possibly initialized, outside of any function or struct. For example:

```
package main
var key str = "P6!7^P1Mme)LP+zcE=pH ^z_eg[3$OZY^rRg+D7R:-~7C/Db{{"}"}}w@Q&WX3vGZJXvVJ"
var globalCounter i32

func main () (out i32) {{"{"}}
	var localCounter i32
	out := addI32(localCounter, globalCounter)
{{"}"}}
```

Any global or local variable which is not explicitly initialized will be automatically initialized to its corresponding zero-value. For example, 32 bit integer variables are initialized to 0, 32 bit floats are initialized to 0.0, strings to the empty character string (""), booleans to false, etc. Other packages can access to global definitions too by using the definition's full name (e.g., Math.Sqrt. Read more about [packages](#packages) to know about accessing definitions and functions from other packages).

## Structs

Structs, as in other programming laguages such as C or Golang, are used to create user-defined types. For example:

```
type Student struct {{"{"}}
	name str
	controlNumber i32
	age i32
	address str
	smoker bool
{{"}"}}
```

The example above illustrates how a struct can be defined in CX. The keyword "type" starts a struct definition, and an identifier for that struct and the keyword "struct" need to follow. The group of variables or fields that will define the user-defined type are enclosed by braces. In this case, a Student type is defined, and has the fields: name, controlNumber, age, address, and a field that indicates if the student is a smoker or not.

## Functions

Functions are the most complex elements in CX, as they can contain many other different elements. First, let's check a function definition that does absolutely nothing:

```
func nothing () () {{"{"}}}
```

Every function definition needs to start with the keyword "func." Then we need to give this function a name, which is "nothing" in this example. The two pairs of parentheses that follow are used to indicate how many parameters the function is going to receive and return, as well as their names and types. Finally, any expression or statement that we want the function to run needs to be enclosed in the braces. Let's now define a function which prints a name to the console:

```
func printName (name str) () {{"{"}}
	printStr(name)
{{"}"}}
```

In this case, the function receives a single parameter: name. This parameter needs to be of the string type (str). The one and only expression that is going to be executed when calling this function is printStr(name), which, well, prints to the console the name that was sent. If we want to indicate that a function will receive or return multiple parameters, these need to be separated by a comma. Let's check out another example:

```
func multiReturn (num1 i32, num2 i32) (add i32, sub i32, mul i32, div i32) {{"{"}}
	add := addI32(num1, num2)
	sub := subI32(num1, num2)
	mul := mulI32(num1, num2)
	div := divI32(num1, num2)
{{"}"}}
```

The multiReturn function (extracted from the [examples](/App/Examples) section) illustrates how a multiple input and multiple output function can be defined. This function returns the sum, subtraction, multiplication and division of two numbers.

To learn more about the elements of a function, have a look at the CX [examples](/App/Examples) and the control structures, initialization sections.

# Flow-control structures

## If and if/else

The if and the if/else statements work just like in other programming languages, and its syntax is similar to Go's syntax:

```
if gtI32(5, 3) {{"{"}}
	printStr("5 is greater than 3")
{{"}"}}
```

The keyword "if" starts an if statement. A condition or predicate needs to follow, which will indicate CX if the following block of statements can be executed or not.

```
if eqStr("password123", "password123") {{"{"}}
	printStr("Access granted")
{{"}"}} else {{"{"}}
	printStr("Access denied")
{{"}"}}
```

If an "else" keyword follows the first block of statements, you can add a second block of statements. The first block is executed if the predicate evaluates to true, and the second block is executed if the predicate evaluates to false.

## While

The while statement is used to create loops in CX. The "while" keyboard starts a while statement, and a condition or predicate needs to follow it. If the predicate evaluates to true, the block of statements enclosed by braces is executed. After executing this block of statements, the predicate is re-evaluated. If the predicate evaluates again to true, the block of statements will be executed again. This process will be repeated until the predicate evaluates to false.

The example below shows a simple while loop that prints the numbers from 0 to 9 to the console.

```
while ltI32(counter, 10) {{"{"}}
	printI32(counter)
	counter = addI32(counter, 1)
{{"}"}}
```

The while loop can also be used to iterate over arrays. An example of this process can be seen in the example below, where value in an array of 32 bit floats is accessed and summed to later calculate their mean.

```
func Mean (vals []f32) (mean f32) {{"{"}}
	if eqI32(lenF32A(vals), 0) {{"{"}}
		printStr("error?")
		halt("Stat.Mean: division by 0")
	{{"}"}}
	var sum f32 = 0.0
	var counter i32 = 0
	while ltI32(counter, lenF32A(vals)) {{"{"}}
		sum = addF32(sum, readF32A(vals, counter))
		counter = addI32(counter, 1)
	{{"}"}}
	mean = divF32(sum, i32ToF32(lenF32A(vals)))
{{"}"}}
```

## Go-to

All of the flow-control structures described in this section are internally parsed to structures that use the goTo native function. Actually, if we have a look at the [standard library](standard-library), under the "flow-control functions", we'll see that there's only one function described: goTo.

The goTo function takes a predicate as its first parameter. If the predicate evaluates to true, the program will move forward or backward the number of lines defined by the second parameter. If the predicate evaluates to true, the number of lines to move forward or backward will be the number defined by the third parameter.

An example of its use is below. In this example, an implementation of an if statement is defined by the basicIf function.

```
func basicIf (num i32) (num i32) {{"{"}}
	pred := gtI32(num, 0)
	goTo(pred, 1, 3)
	printStr("Greater than 0")
	goTo(true, 10, 0)
	printStr("Less than 0")
{{"}"}}
```

# Initialization

## Variables

Variables can be declared by using the "var" keyword inside a function. They are similar to definitions, with the difference that the scope of variables is limited to the function where they are declared. This is why they are sometimes referred to as locals, and definitions are sometimes referred to as globals.

```
var foo str
```

All variable declarations are implicitly initialized to the corresponding zero-value of the variable's type, if they are not explicitly initialized, of course. In the example above, the foo variable is not explicitly initialized, so its value after being declared is "" (an empty string). In order to do an explicit initialization, we can use the "=" keyword, followed by a value to be assigned to this variable:

```
var foo str = "Stay awhile and listen!"
```

Variables can also be declared and initialized with the values returned by expressions. In this case, the "var" keyword must not be used, and the ":=" keyword has to be used instead of "=". Also, stating the type is not necessary and must not be added, as the variable will adopt the type of the value returned by the expression.

```
foo := addI32(5, 10)
```

In the example above, after evaluating the expression to the right of the ":=" keyword, the foo variable will be of type i32, and will hold the value 15. The foo variable can change its value later on in the program by using the "=" keyword:

```
foo = mulI32(10, 10)
```

# Debugging

In its development stage, a program in CX should be built and debugged in using the REPL. In the REPL mode, the programmer can control the execution of the program, interactively add and/or remove expressions, functions, structs, modules, etc. Check out the [examples](/App/Examples) section to learn more about meta-programming commands.

If a program is not executed in the REPL mode, and an error is encountered, the program will enter in the REPL mode to give the programmer or administrator the opportunity to fix the error. For example, the programmer can change the values of the local variables, function expressions can be altered, etc.

# Standard library

Every CX program has direct access to a package that defines the native functions. This package is called the "core" package, and it's not necessary to import it nor to append its name to the identifiers of the native functions, e.g., if you want to call addI32, it's not necessary to write core.addI32.

A description of each of the functions defined in the core package is provided below. These descriptions also include what parameters receive and return, as well as examples of their usage.

## Arithmetic functions

#### →addI32 (_number i32, number i32_) (_number i32_)

#### →addI64 (_number i64, number i64_) (_number i64_)

#### →addF32 (_number f32, number f32_) (_number f32_)

#### →addF64 (_number f64, number f64_) (_number f64_)

This group of functions perform the addition between two numbers of the same type. A different version of the addition function is provided for each of the supported primitive types.

**Examples:**

```
apples := addI32(5, 3)
views := addI64(i32ToI64(1111), i32ToI64(3333))
litres := addF32(3.3, 4.4)
error := addF64(f32ToF64(0.00031331), f32ToF64(0.000025211))
```

#### →subI32 (_number i32, number i32_) (_number i32_)

#### →subI64 (_number i64, number i64_) (_number i64_)

#### →subF32 (_number f32, number f32_) (_number f32_)

#### →subF64 (_number f64, number f64_) (_number f64_)

This group of functions perform the subtraction between two numbers of the same type. A different version of the subtraction function is provided for each of the supported primitive types.

**Examples:**

```
apples := subI32(5, 3)
views := subI64(i32ToI64(3333), i32ToI64(1111))
litres := subF32(3.3, 4.4)
error := subF64(f32ToF64(0.00031331), f32ToF64(0.000025211))
```

#### →mulI32 (_number i32, number i32_) (_number i32_)

#### →mulI64 (_number i64, number i64_) (_number i64_)

#### →mulF32 (_number f32, number f32_) (_number f32_)

#### →mulF64 (_number f64, number f64_) (_number f64_)

This group of functions perform the multiplication between two numbers of the same type. A different version of the multiplication function is provided for each of the supported primitive types.

**Examples:**

```
apples := mulI32(5, 3)
views := mulI64(i32ToI64(3333), i32ToI64(1111))
litres := mulF32(3.3, 4.4)
error := mulF64(f32ToF64(0.00031331), f32ToF64(0.000025211))
```

#### →divI32 (_number i32, number i32_) (_number i32_)

#### →divI64 (_number i64, number i64_) (_number i64_)

#### →divF32 (_number f32, number f32_) (_number f32_)

#### →divF64 (_number f64, number f64_) (_number f64_)

This group of functions perform the division between two numbers of the same type. A different version of the division function is provided for each of the supported primitive types. If the denominator is equal to 0, a division by 0 error is raised.

**Examples:**

```
apples := divI32(5, 3)
views := divI64(i32ToI64(3333), i32ToI64(1111))
litres := divF32(3.3, 4.4)
error := divF64(f32ToF64(0.00031331), f32ToF64(0.000025211))
```

#### →modI32 (_number i32, number i32_) (_number i32_)

#### →modI64 (_number i64, number i64_) (_number i64_)

modI32 and modI64 perform the modulus operation between two numbers of the same type (i32 and i64, respectively). If the denominator is equal to 0, a division by 0 error is raised.

**Examples:**

```
remainder := modI32(5, 3)
remainder := modI64(i32ToI64(3333), i32ToI64(1111))
```

## Flow-control functions

#### →goTo (_predicate bool, thenLines i32, elseLines i32_) (_error bool_)

goTo evaluates a predicate, and if it evaluates to true, the program advances the number of lines defined by thenLines (second parameter), and if it evaluates to false, the program advances the number of lines defined by elseLines. thenLines and elseLines can be negative numbers.

**Example:**

```
func basicIf (num i32) (num i32) {{"{"}}
	pred := gtI32(num, 0)
	goTo(pred, 1, 3)
	printStr("Greater than 0")
	goTo(true, 10, 0)
	printStr("Less than 0")
{{"}"}}
```

## Printing functions

#### →printStr (_object str_) (_object str_)

#### →printBool (_object bool_) (_object bool_)

#### →printByte (_object byte_) (_object byte_)

#### →printI32 (_object i32_) (_object i32_)

#### →printI64 (_object i64_) (_object i64_)

#### →printF32 (_object f32_) (_object f32_)

#### →printF64 (_object f64_) (_object f64_)

#### →printBoolA (_object \[\]bool_) (_object \[\]bool_)

#### →printByteA (_object \[\]byte_) (_object \[\]byte_)

#### →printI32A (_object \[\]i32_) (_object \[\]i32_)

#### →printI64A (_object \[\]i64_) (_object \[\]i64_)

#### →printF32A (_object \[\]f32_) (_object \[\]f32_)

#### →printF64A (_object \[\]f64_) (_object \[\]f64_)

This group of functions take a single argument as their input parameter, prints it the console, and then returns the argument as its output.

**Examples:**

```
printStr("greetings stranger!")
printBool(false)
printByte(i32ToByte(50))
printI32(5)
printI64(i32ToI64(10))
printF32(3.14159)
printF64(f32ToF64(3.14159))
printBoolA([]bool{{"{"}}true, false, false{{"}"}})
printByteA([]byte{{"{"}}1, 2, 3, 4{{"}"}})
printI32A([]i32{{"{"}}1, 2, 3, 4{{"}"}})
printI64A([]i64{{"{"}}1, 2, 3, 4{{"}"}})
printF32A([]i64{{"{"}}1.5, 2.5, 3.5, 4.5{{"}"}})
printF64A([]i64{{"{"}}1.5, 2.5, 3.5, 4.5{{"}"}})
```

## Identity functions

#### →idStr (_object str_) (_object str_)

#### →idBool (_object bool_) (_object bool_)

#### →idByte (_object byte_) (_object byte_)

#### →idI32 (_object i32_) (_object i32_)

#### →idI64 (_object i64_) (_object i64_)

#### →idF32 (_object f32_) (_object f32_)

#### →idF64 (_object f64_) (_object f64_)

#### →idBoolA (_object \[\]bool_) (_object \[\]bool_)

#### →idByteA (_object \[\]byte_) (_object \[\]byte_)

#### →idI32A (_object \[\]i32_) (_object \[\]i32_)

#### →idI64A (_object \[\]i64_) (_object \[\]i64_)

#### →idF32A (_object \[\]f32_) (_object \[\]f32_)

#### →idF64A (_object \[\]f64_) (_object \[\]f64_)

This group of functions take a single argument as their input parameter, and then returns the argument as its output. These functions are the equivalent to the math function f(x) = x. These functions might not be of so much use in most programs, but CX uses them to parse programs and are provided to the user (like goTo).

**Examples:**

```
printStr("greetings stranger!")
printBool(false)
printByte(i32ToByte(50))
printI32(5)
printI64(i32ToI64(10))
printF32(3.14159)
printF64(f32ToF64(3.14159))
printBoolA([]bool{{"{"}}true, false, false{{"}"}})
printByteA([]byte{{"{"}}1, 2, 3, 4{{"}"}})
printI32A([]i32{{"{"}}1, 2, 3, 4{{"}"}})
printI64A([]i64{{"{"}}1, 2, 3, 4{{"}"}})
printF32A([]i64{{"{"}}1.5, 2.5, 3.5, 4.5{{"}"}})
printF64A([]i64{{"{"}}1.5, 2.5, 3.5, 4.5{{"}"}})
```

## Array functions

#### →readBoolA (_array \[\]bool, index i32_) (_element bool_)

#### →readByteA (_array \[\]byte, index i32_) (_element byte_)

#### →readI32A (_array \[\]i32, index i32_) (_element i32_)

#### →readI64A (_array \[\]i64, index i32_) (_element i64_)

#### →readF32A (_array \[\]f32, index i32_) (_element f32_)

#### →readF64A (_array \[\]f64, index i32_) (_element f64_)

This group of functions read an element from the given array that corresponds to the element at the given index. If the index exceeds the length of the provided array, an error is raised. If the index is negative, an error is raised.

**Examples:**

```
readBoolA([]bool{{"{"}}true, false, true{{"}"}}, 0)
readByteA([]byte{{"{"}}1, 2, 3, 4{{"}"}}, 2)
readI32A([]i32{{"{"}}10, 20, 30, 40{{"}"}}, 3)
readI64A([]i64{{"{"}}10, 20, 30, 40{{"}"}}, 2)
readF32A([]f32{{"{"}}1.1, 2.2, 3.3, 4.4{{"}"}}, 1)
readF64A([]f64{{"{"}}1.1, 2.2, 3.3, 4.4{{"}"}}, 0)
```

#### →writeBoolA (_array \[\]bool, index i32, element bool_) (_array \[\]bool_)

#### →writeByteA (_array \[\]byte, index i32, element byte_) (_array \[\]byte_)

#### →writeI32A (_array \[\]i32, index i32, element i32_) (_array \[\]i32_)

#### →writeI64A (_array \[\]i64, index i32, element i64_) (_array \[\]i64_)

#### →writeF32A (_array \[\]f32, index i32, element f32_) (_array \[\]f32_)

#### →writeF64A (_array \[\]f64, index i32, element f64_) (_array \[\]f64_)

This group of functions write the given element to the given array, at the given index. If the index exceeds the length of the provided array, an error is raised. If the index is negative, an error is raised.

**Examples:**

```
writeBoolA([]bool{{"{"}}true, false, true{{"}"}}, 0)
writeByteA([]byte{{"{"}}1, 2, 3, 4{{"}"}}, 2, i32ToByte(10))
writeI32A([]i32{{"{"}}10, 20, 30, 40{{"}"}}, 3, 30)
writeI64A([]i64{{"{"}}10, 20, 30, 40{{"}"}}, 2, i32ToI64(50))
writeF32A([]f32{{"{"}}1.1, 2.2, 3.3, 4.4{{"}"}}, 1, 7.4)
writeF64A([]f64{{"{"}}1.1, 2.2, 3.3, 4.4{{"}"}}, 0, f32ToF64(10.10))
```

#### →lenBoolA (_array \[\]bool_) (_length i32_)

#### →lenByteA (_array \[\]byte_) (_length i32_)

#### →lenI32A (_array \[\]i32_) (_length i32_)

#### →lenI64A (_array \[\]i64_) (_length i32_)

#### →lenF32A (_array \[\]f32_) (_length i32_)

#### →lenF64A (_array \[\]f64_) (_length i32_)

These functions calculate and return the length of the given array.

**Examples:**

```
lenBoolA([]bool{{"{"}}true, false, true{{"}"}})
lenByteA([]byte{{"{"}}1, 2, 3, 4{{"}"}})
lenI32A([]i32{{"{"}}10, 20, 30, 40{{"}"}})
lenI64A([]i64{{"{"}}10, 20, 30, 40{{"}"}})
lenF32A([]f32{{"{"}}1.1, 2.2, 3.3, 4.4{{"}"}})
lenF64A([]f64{{"{"}}1.1, 2.2, 3.3, 4.4{{"}"}})
```

## Casting functions

#### →byteAToStr (_array \[\]byte_) (_string str_)

#### →strToByteA (_string str_) (_array \[\]byte_)

A string is internally represented as an array of bytes. This implies that a byte array can be casted to a character string, and a character string can be casted to a byte array.

**Examples:**

```
byteAToStr([]byte{{"{"}}0, 1, 2{{"}"}})
strToByteA("hello")
```

#### →i64ToI32 (_number i64_) (_number i32_)

#### →f32ToI32 (_number f32_) (_number i32_)

#### →f64ToI32 (_number f64_) (_number i32_)

These functions cast their argument to an i32 number.

**Examples:**

```
i64ToI32(i32ToI64(5))
f32ToI32(5.12)
f64ToI32(f32ToF64(3.3))
```

#### →i32ToI64 (_number i32_) (_number i64_)

#### →f32ToI64 (_number f32_) (_number i64_)

#### →f64ToI64 (_number f64_) (_number i64_)

These functions cast their argument to an i64 number.

**Examples:**

```
i32ToI64(5)
f32ToI64(5.12)
f64ToI64(f32ToF64(3.3))
```

#### →i32ToF32 (_number i32_) (_number f32_)

#### →i64ToF32 (_number i64_) (_number f32_)

#### →f64ToF32 (_number f64_) (_number f32_)

These functions cast their argument to an f32 number.

**Examples:**

```
i32ToF32(5)
i64ToF32(i32ToI64(22))
f64ToF32(f32ToF64(3.3))
```

#### →i32ToF64 (_number i32_) (_number f64_)

#### →i64ToF64 (_number i64_) (_number f64_)

#### →f32ToF64 (_number f32_) (_number f64_)

These functions cast their argument to an f64 number.

**Examples:**

```
i32ToF64(5)
i64ToF64(i32ToI64(22))
f32ToF64(3.3)
```

#### →i64AToI32A (_array \[\]i64_) (_array \[\]i32_)

#### →f32AToI32A (_array \[\]f32_) (_array \[\]i32_)

#### →f64AToI32A (_array \[\]f64_) (_array \[\]i32_)

These functions cast their argument to an \[\]i32 array.

**Examples:**

```
i64AToI32A([]i64{{"{"}}1, 2, 3{{"}"}})
f32AToI32A([]f32{{"{"}}1.1, 2.2, 3.3{{"}"}})
f64AToI32A([]f64{{"{"}}1.1, 2.2, 3.3{{"}"}})
```

#### →i32AToI64A (_array \[\]i32_) (_array \[\]i64_)

#### →f32AToI64A (_array \[\]f32_) (_array \[\]i64_)

#### →f64AToI64A (_array \[\]f64_) (_array \[\]i64_)

These functions cast their argument to an \[\]i64 array.

**Examples:**

```
i32AToI64A([]i32{{"{"}}1, 2, 3{{"}"}})
f32AToI64A([]f32{{"{"}}1.1, 2.2, 3.3{{"}"}})
f64AToI64A([]f64{{"{"}}1.1, 2.2, 3.3{{"}"}})
```

#### →i32AToF32A (_array \[\]i32_) (_array f32_)

#### →i64AToF32A (_array \[\]i64_) (_array f32_)

#### →f64AToF32A (_array \[\]f64_) (_array f32_)

These functions cast their argument to an \[\]f32 array.

**Examples:**

```
i32AToF32A([]i32{{"{"}}1, 2, 3{{"}"}})
i64AToF32A([]i64{{"{"}}1, 2, 3{{"}"}})
f64ToF32A([]f64{{"{"}}1.1, 2.2, 3.3{{"}"}})
```

#### →i32AToF64A (_array \[\]i32_) (_array \[\]f64_)

#### →i64AToF64A (_array \[\]i64_) (_array \[\]f64_)

#### →f32AToF64A (_array \[\]f32_) (_array \[\]f64_)

These functions cast their argument to an \[\]f64 array.

**Examples:**

```
i32AToF64A([]i32{{"{"}}1, 2, 3{{"}"}})
i64AToF64A([]i64{{"{"}}1, 2, 3{{"}"}})
f32ToF64A([]f32{{"{"}}1.1, 2.2, 3.3{{"}"}})
```

## System functions

#### →sleep (_milliseconds i32_) (_milliseconds i32_)

Sleep halts a program for the amount of time defined by its argument. The amount of time is given in milliseconds.

**Example:**

```
sleep(1000)
```

#### →halt (_message str_) (_message str_)

Halt is similar to sleep in that a program is paused temporarily. However, halt is usually used to inform the user that an error has been encountered. The program enters REPL mode after a call to halt has been encountered, so the programmer can start modifying the bugged program. Once the programmer has fixed the issues, a :step 0; meta-programming command can be issued to resume execution.

**Example:**

```
halt("A score > 1000 has been reached.")
```

## Affordance inference functions

#### →setClauses (_clauses str_) (_clauses str_)

Clauses are rules and/or facts used by the affordance system to determine if an affordance can be applied or not. setClauses receives a string containing prolog clauses. The programmer can provide the affordance system with any clauses, following any format, as long as the query (see setQuery below) can use them in combination with the defined objects (see addObject below).

**Example:**

```
halt("A score > 1000 has been reached.")
```

#### →setQuery (_query str_) (_query str_)

Lorem ipsum dolor sit amet

#### →addObject (_object str_) (_object str_)

Lorem ipsum dolor sit amet

#### →remObject (_object str_) (_object str_)

Lorem ipsum dolor sit amet

#### →remObjects () (_error bool_)

Lorem ipsum dolor sit amet

## Random numbers functions

#### →randI32 (_min i32, max i32_) (_number i32_)

Lorem ipsum dolor sit amet

#### →randI64 (_min i64, max i64_) (_number i64_)

Lorem ipsum dolor sit amet

## Meta-programming functions

Selectors. Stepping. Debugging (dStack, dProgram, dState). Affordances. Removers. Prolog.

#### →remExpr (_fnName str, num i32_) (_error bool_)

Lorem ipsum dolor sit amet

#### →remArg (_fnName str_) (_error bool_)

Lorem ipsum dolor sit amet

#### →addExpr (_fnName str_) (_error bool_)

Lorem ipsum dolor sit amet

#### →exprAff (_filter str_) (_error bool_)

Lorem ipsum dolor sit amet

#### →evolve (_fnName str, fnBag str, inputs \[\]f64, outputs \[\]f64, numberExprs i32, iterations i32, epsilon f64_) (_error f64_)

Lorem ipsum dolor sit amet

## Logical operators

#### →and (_premise bool, premise bool_) (_conclusion bool_)

Lorem ipsum dolor sit amet

#### →or (_premise bool, premise bool_) (_conclusion bool_)

Lorem ipsum dolor sit amet

#### →not (_premise bool_) (_conclusion bool_)

Lorem ipsum dolor sit amet

## Relational operators

#### →ltStr (_string str, string str_) (_conclusion bool_)

#### →ltByte (_number byte, number byte_) (_conclusion bool_)

#### →ltI32 (_number i32, number i32_) (_conclusion bool_)

#### →ltI64 (_number i64, number i64_) (_conclusion bool_)

#### →ltF32 (_number f32, number f32_) (_conclusion bool_)

#### →ltF64 (_number f64, number f64_) (_conclusion bool_)

Lorem ipsum dolor sit amet

#### →gtStr (_string str, string str_) (_conclusion bool_)

#### →gtByte (_number byte, number byte_) (_conclusion bool_)

#### →gtI32 (_number i32, number i32_) (_conclusion bool_)

#### →gtI64 (_number i64, number i64_) (_conclusion bool_)

#### →gtF32 (_number f32, number f32_) (_conclusion bool_)

#### →gtF64 (_number f64, number f64_) (_conclusion bool_)

Lorem ipsum dolor sit amet

#### →eqStr (_string str, string str_) (_conclusion bool_)

#### →eqByte (_number byte, number byte_) (_conclusion bool_)

#### →eqI32 (_number i32, number i32_) (_conclusion bool_)

#### →eqI64 (_number i64, number i64_) (_conclusion bool_)

#### →eqF32 (_number f32, number f32_) (_conclusion bool_)

#### →eqF64 (_number f64, number f64_) (_conclusion bool_)

Lorem ipsum dolor sit amet

#### →lteqStr (_string str, string str_) (_conclusion bool_)

#### →lteqByte (_number byte, number byte_) (_conclusion bool_)

#### →lteqI32 (_number i32, number i32_) (_conclusion bool_)

#### →lteqI64 (_number i64, number i64_) (_conclusion bool_)

#### →lteqF32 (_number f32, number f32_) (_conclusion bool_)

#### →lteqF64 (_number f64, number f64_) (_conclusion bool_)

Lorem ipsum dolor sit amet

#### →gteqStr (_string str, string str_) (_conclusion bool_)

#### →gteqByte (_number byte, number byte_) (_conclusion bool_)

#### →gteqI32 (_number i32, number i32_) (_conclusion bool_)

#### →gteqI64 (_number i64, number i64_) (_conclusion bool_)

#### →gteqF32 (_number f32, number f32_) (_conclusion bool_)

#### →gteqF64 (_number f64, number f64_) (_conclusion bool_)

Lorem ipsum dolor sit amet

## Bitwise operators

#### →andI32 (_number i32, number i32_) (_number i32_)

#### →andI64 (_number i64, number i64_) (_number i64_)

Lorem ipsum dolor sit amet

#### →orI32 (_number i32, number i32_) (_number i32_)

#### →orI64 (_number i64, number i64_) (_number i64_)

Lorem ipsum dolor sit amet

#### →xorI32 (_number i32, number i32_) (_number i32_)

#### →xorI64 (_number i64, number i64_) (_number i64_)

Lorem ipsum dolor sit amet

#### →andNotI32 (_number i32, number i32_) (_number i32_)

#### →andNotI64 (_number i64, number i64_) (_number i64_)

Lorem ipsum dolor sit amet
