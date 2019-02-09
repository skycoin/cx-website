# CX Programming Language

CX is a general purpose, interpreted and compiled programming language, with a very strict type system and a syntax similar to Golang's. CX provides a new programming paradigm based on the concept of affordances, where the user can ask the programming language at runtime what can be done with a CX object (functions, expressions, packages, etc.), and interactively or automatically choose one of the affordances to be applied. This paradigm has the main objective of providing an additional security layer for decentralized, blockchain-based applications, but can also be used for general purpose programming.

In the following sections, the reader can find a short tutorial on how to use the main features of the language. In previous versions of this README file, the tutorial was written in a book-ish style and was targetted to a beginner audience. We're going to be making a transition from that style to a more technical style, without falling into a pure documentation style. The reason behind this is that a CX book is now going to be published, which is going to be targetted to a more beginner audience. Thus, this README now has the purpose of quickly demonstrating the capabilities of the language, how to install it, etc.

This tutorial/documentation is divided into four parts, which can broadly be described as introduction, syntax, runtime and native functions. The first section presents general information about the language, such as how to install it, the development roadmap, etc. The second and third sections are more tutorial-ish, where the reader can find information about the core language, i.e. how your program needs to look so it's considered a valid CX program (syntax), and how your CX program is going to be executing (runtime). The last section follows a more documentation style, where each of the native functions of the language is presented, along with an example.

## Compiled and interpreted

The CX specification enforces a CX dialect to provide the developer with both an interpreter and a compiler. An interpreted program is far slower than its compiled counterpart, as is expected, but will allow a more flexible program. This flexibility comes from meta-programming functions, and affordances, which can modify a program’s structure during runtime.

A compiled program needs a more rigid structure than an interpreted program, as many of the optimizations leverage this rigidity. As a consequence, the affordance system and any function that operates over the program’s structure will be limited in functionality in a compiled program.

The compiler should be used when performance is the biggest concern, while a program should remain being interpreted when the programmer requires all the flexibility provided by the CX features.

## Strict typing system

There is no implicit casting in CX. Because of this, multiple versions for each of the primitive types are defined in the core module. For example, four native functions for addition exist: addI32, addI64, addF32, and addF64.

The parser attaches a default type to data it finds in the source code: if an integer is read, its default type is i32 or 32 bit integer; and if a float is read, its default type is f32 or 32 bit float. There is no ambiguity with other data read by the parser: true and false are always booleans; a series of characters enclosed between double quotes are always strings; and array needs to indicate its type before the list of its elements, e.g., \[\]i64{{'{'}} 1, 2, 3{{'}'}} .

For the cases where the programmer needs to explicitly cast a value of one type to another, the core module provides a number of cast functions to work with primitive types. For example, byteAToStr casts a byte array to a string, and i32ToF32 casts a 32 bit integer to a 32 bit float.

## Affordances

A programmer needs to make a plethora of decisions while constructing a program, e.g., how many parameters a function must receive, how many parameters it must return, what statements are needed to obtain the desired functionality, and what arguments need to be sent as parameters to the statement functions, among others. The affordance system in CX can be queried to obtain a list of the possible actions that can be applied to an element.

## Serialization

A program in CX can be partially or fully serialized to a byte array. This serialization capability allows a program to create a program image (similar to system images), where the exact state at which the program was serialized is maintained. This means that a serialized program can be deserialized, and resume its execution later on. Serialiation can also be used to create backups.

A CX program can leverage its integrated features to create some interesting scenarios. For example, a program can be serialized to create a backup of itself, and start an evolutionary algorithm on one of its functions. If the evolutionary algorithm finds a function that performs better than the previous definition, one can keep this new version of the program. However, if the evolutionary algorithm performed badly, the program can be restored to the saved backup. All of these tasks can be automated.

## Stepping

### Interactive evaluation

The affordance system and meta-programming functions in CX allow the flexibility of changing the program’s structure in a supervised manner. However, affordances can still be automated by having a function that selects the index of the affordance to be applied.

_evolve_ is a native function that constructs user-defined functions by using random affordances.

_evolve_ follows the principles of evolutionary computation. In particular, evolve performs a technique called genetic programming. Genetic programming tries to find a combination of operators and arguments that will solve a problem. For example, you could instruct evolve to find a combination of operators that, when sent 10 as an argument, returns 20. This might sound trivial, but genetic programming and other evolutionary algorithms can solve very complicated problems.

### Interactive debugging

A CX program will enter the REPL mode once an error has been found. This behaviour gives the programmer the opportunity to debug the program before attempting to resume its execution.
