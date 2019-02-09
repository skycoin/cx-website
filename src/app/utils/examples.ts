export const programs = [
  {
    id: 1,
    name: 'Hello world',
    code: `
package main

func main () () {
  str.print("Hello World!")
}`
  },
  {
    id: 2,
    name: 'Looping',
    code: `
package main

func main () () {
  for c := 0; i32.lt(c, 20); c = i32.add(c, 1) {
    i32.print(c)
  }
}`
  },
  {
    id: 3,
    name: 'Factorial',
    code: `
package main

func factorial (num i32) (fact i32) {
  if i32.eq(num, 1) {
    fact = 1
  } else {
    fact = i32.mul(num, factorial(i32.sub(num, 1)))
  }
}

func main () () {
  i32.print(factorial(6))
}`
  },
];
