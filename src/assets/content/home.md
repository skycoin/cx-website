## Latest release: CX v0.6

**Serialization**

A CX program has a 'binary' representation that is intended to go on the blockchain. This binary representation is often called a bytecode, and is a common feature in many language. The difference between CX and most other languages is that in CX you have a bytecode representation of both the program itself, and a running state. CX 0.6 has serialization of any program and running state as well as deserialization of both.

So in the next step of the Sky development, you will be able to store a CX program on a blockchain (a chain on Fiber) and store the state of it also on the chain. The next time the program is started, the state will be read from the chain, and continued from where it left off, run for a while, providing a service of some kind, and then the new state will be put back into a new block. This is similar to what is called a smart contract on other blockchains.

**Language Improvements**

There are a number of new language features that were present in late release of CX 0.5, but are now officially supported. These are:

*   Functions as first-class objects
*   Callbacks (used in some libraries, like OpenGL)
*   Much improved handling of slices, esp. resize/copy/insert/remove functions, and boundary checks.
*   New control flow keywords: break and continue
*   New formatting for printf: %v for values of any type
*   Labels can now appear anywhere in a function.
*   Improved error reporting
*   ...and many improvements that were introduced during late stages of CX 0.5

**Library Improvements**

Added GIF support to OpenGL

[Read more at GitHub](https://github.com/skycoin/cx/releases)
