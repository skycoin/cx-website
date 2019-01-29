export const programs = [
  {
    name: 'Hello world',
    code: `
package main

func main () () {
  str.print("Hello World!")
}
    `
  },
  {name: 'Looping', code: 'package main\r\n\r\nfunc main () () {\r\n\tfor c := 0; i32.lt(c, 20); c = i32.add(c, 1) {\r\n\t\ti32.print(c)\r\n\t}\r\n}'},
  {name: 'Factorial', code: 'package main\r\n\r\nfunc factorial (num i32) (fact i32) {\r\n\tif i32.eq(num, 1) {\r\n\t\tfact = 1\r\n\t} else {\r\n\t\tfact = i32.mul(num, factorial(i32.sub(num, 1)))\r\n\t}\r\n}\r\n\r\nfunc main () () {\r\n\ti32.print(factorial(6))\r\n}'},
]
