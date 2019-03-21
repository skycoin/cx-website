# CX Installation

## Binary Releases

This repository provides new binary releases of the language every
week. Check this link and download the appropriate binary release for
your platfrom: https://github.com/skycoin/cx/releases

More platforms will be added in the future.

CX has been successfully installed and tested in recent versions of
Linux (Ubuntu), MacOS X and Windows. Nevertheless, if you run into any
problems, please create an issue and we'll try to solve the problem as
soon as possible.

Once you have downloaded and de-compressed the binary release file,
you should place it somewhere in your operating system's $PATH
environment variable (or similar). The purpose of this is to have cx
globally accessible when using the terminal.

If you don't want to have it globally accessible, you can always try
out CX locally, inside the directory where you have the binary file.

### MacOS Homebrew Install

The simplest way to install CX on MacOS is to use the Homebrew package manager to install the prebuilt binary release. If you do not already have Homebrew installed, please visit the [Homebrew website](https://brew.sh/) for installation instructions.

Once Homebrew is installed, use the following commands to setup the Tap and then install CX.

```
brew tap skycoin/homebrew-skycoin
brew install skycoin-cx
```

To update use the following command:

```
brew update skycoin-cx
```

Note: The Homebrew formule is currently hosted in GitHub by BigOokie - this will likely change in the near future.

## Compiling from Source

If a binary release is not currently available for your platfrom or if
you want to have a nightly build of CX, you'll have to compile from
source. If you're not familiarized with Go, Git, your OS's terminal or
your OS's package manager (to name a few), we *strongly* recommend you
to try out a binary release. If you find any bugs or problems with the
binary release, submit an issue here:
https://github.com/skycoin/cx/issues, and we'll fix it for the next
week's release.

## Installing Go

In order to compile CX from source, first make sure that you have Go
installed by running `go version`. It should output something similar to:

```
go version go1.8.3 darwin/amd64
```

**You need a version greater than 1.8, and >1.10 is recommended**

Some linux distros' package managers install very old versions of
Go. You can try first with a binary from your favorite package
manager, but if the installation starts showing errors, try with the
latest version before creating an issue.

Go should also be properly configured (you can read the installation
instructions by clicking [here](https://golang.org/doc/install). Particularly:

* Make sure that you have added the Go binary to your `$PATH`.
  * If you installed Go using a package manager, the Go binary is most
    likely already in your `$PATH` variable.
  * If you already installed Go, but running "go" in a terminal throws
    a "command not found" error, this is most likely the problem.
* Make sure that you have configured your `$GOPATH` environment
variable.
* Make sure that you have added `$GOPATH/bin` to you `$PATH`.
  * If you have binaries installed in `$GOPATH/bin` but you can't use
    them by just typing their name wherever you are in the file system
    in a terminal, then this will solve the problem.

As an example configuration, considering you're using *bash* in
*Ubuntu*, you would append to your `~/.bashrc` file this:

```
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin/
```

Don't just copy/paste that; think on what you're doing!

## Additional Notes Before the Actual Installation

### Linux: Installing OpenGL and GLFW Dependencies

#### Debian-based Linux Distributions

\* Based on instructions from [Viscript](https://github.com/skycoin/viscript)'s repository.

CX comes with OpenGL and GLFW APIs. In order to use them, you need to
install some dependencies. If you're using a Debian based Linux
distro, such as Ubuntu, you can run these commands:

```
sudo apt-get install libxi-dev
sudo apt-get install libgl1-mesa-dev
sudo apt-get install libxrandr-dev
sudo apt-get install libxcursor-dev
sudo apt-get install libxinerama-dev
```

and you should be ready to go.

### Windows: Installing GCC

You might need to install GCC. Try installing everything first
without installing GCC, and if an error similar to "gcc: command not
found" is shown, you can fix this by installing MinGW.

Don't get GCC through Cygwin; apparently, [Cygwin has compatibility
issues with Go](https://github.com/golang/go/issues/7265#issuecomment-66091041).

Users have reported that using either [MingW](http://www.mingw.org/)
or [tdm-gcc](http://tdm-gcc.tdragon.net), where tdm-gcc seems to be the
easiest way.

## Installing CX

Make sure that you have `curl` and `git` installed. Run this command in a terminal:

```
sh <(curl -s https://raw.githubusercontent.com/skycoin/cx/master/cx.sh)
```

If you're skeptical about what this command does, you can check the
source code in this project. Basically, this script checks if you have
all the necessary Golang packages and tries to install them for
you. The script even downloads this repository and installs CX for
you. This means that you can run `cx` after running the script and see
the REPL right away (if the script worked). To exit the REPL, you can press `Ctrl-D`.

You should test your installation by running `cx
$GOPATH/src/github.com/skycoin/cx/tests`.

As an alternative, you could clone into this repository and run cx.sh
in a terminal.

### Windows

An installation script is also provided for Windows named `cx-setup.bat`.
The Windows version of this method would be to manually
download the provided [batch script](https://github.com/skycoin/cx/blob/master/cx-setup.bat) (which is similar to the bash script for *nix systems described above), and run it in a terminal.

You should test your installation by running `cx
%GOPATH%\src\github.com\skycoin\cx\tests`.

## Updating CX

Now you can update CX by simply running the installation script
again:

```
./cx.sh
```

or, in Windows:

```
cx-setup.bat
```

## Running CX
### CX REPL

Once CX has been successfully installed, running `cx` should print
this in your terminal:

```
CX 0.5.13
More information about CX is available at http://cx.skycoin.net/ and https://github.com/skycoin/cx/
:func main {...
	* 
```

This is the CX REPL
([read-eval-print loop](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop)),
where you can debug and modify CX programs. The CX REPL starts with a
barebones CX structure (a `main` package and a `main` function) that
you can use to start building a program.

Let's create a small program to test the REPL. First, write
`str.print("Testing the REPL")` after the `*`, and press enter. After
pressing enter you'll see the message "Testing the REPL" on the screen. If you
then write `:dp` (short for `:dProgram` or *debug program*), you
should get the current program AST printed:

```
Program
0.- Package: main
	Functions
		0.- Function: main () ()
			0.- Expression: str.print("" str)
		1.- Function: *init () ()
```

As we can see, we have a `main` package, a `main` function, and we
have a single expression: `str.print("Testing the REPL")`.

Let's now create a new function. In order to do this, we first need to
leave the `main` function. At this moment, any expression (or function
call) that we add to our program is going to be added to `main`. To
exit a function declaration, press `Ctrl+D`. The prompt (`*`) should
have changed indentation, and the REPL now shouldn't print `:func main
{...` above the prompt:

```go
:func main {...
	* 
* 
```

Now, let's enter a function prototype (an empty function which only
specifies the name, the inputs and the outputs):

```go
* func sum (num1 i32, num2 i32) (num3 i32) {}
* 
```

You can check that the function was indeed added by issuing a `:dp`
command. If we want to add expressions to `sum`, we have to select it:

```go
* :func sum

:func sum {...
	* 
```

Notice that there's a semicolon before `func sum`. Now we can add an expression to it:

```go
:func sum {...
	* num3 = num1 + num2
```

Now, exit `sum` and select `main` with the command `:func main`. Let's
add a call to `sum` and print the value that it returns when giving
the arguments 10 and 20:

```go
:func main {...
	* i32.print(sum(10, 20))
30
```

#### Running CX Programs

To run a CX program, you have to type, for example, `cx
the-program.cx`. Let's try to run some examples from the `examples`
directory in this repository. In a terminal, type this:

```
cd $GOPATH/src/github.com/skycoin/cx/
cx examples/hello-world.cx
```

This should print `Hello World!` in the terminal. Now try running `cx
examples/opengl/game.cx`.

#### Other Options

If you write `cx --help` or `cx -h`, you should see a text describing
CX's usage, options and more.

Some interesting options are:

* `--base` which generates a CX program's assembly code (in Go)
* `--compile` which generates an executable file
* `--repl` which loads the program and makes CX run in REPL mode
(useful for debugging a program)
* `--web` which starts CX as a RESTful web service (you can send code
  to be evaluated to this endpoint: http://127.0.0.1:5336/eval)

#### Hello World

Do you want to know how CX looks? This is how you print "Hello, World!"
in a terminal:

```go
package main

func main () {
    str.print("Hello, World!")
}
```

Every CX program must have at least a *main* package, and a *main*
function. As mentioned before, CX has a strict type system,
where functions can only be associated with a single type
signature. As a consequence,
if we want to print a string, as in the example above, we have to call
*str*'s print function, where *str* is a package containing string
related functions.

However, there are some exceptions, mainly to functions where it makes
sense to have a generalized type signature. For example, the `len`
function accepts arrays of any type as its argument, instead of having
`[]i32.len()` or `[][]str.len()`. Another example is `sprintf`, which
is used to construct a string using a format string and a series of
arguments of any type.
