// This code is derived from the SOM benchmarks, see AUTHORS.md file.
//
// Copyright (c) 2015-2016 Stefan Marr <git@stefan-marr.de>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
// Ported to Nish from the JavaScript version (benchmarks/JavaScript/list.js).

class Element {
  val: i32;
  next: Element | null = null;

  constructor(v: i32) {
    this.val = v;
  }

  length(): i32 {
    const next = this.next;
    if (next === null) {
      return 1;
    }
    return 1 + next.length();
  }
}

export class List {
  innerBenchmarkLoop(innerIterations: i32): boolean {
    for (let i = 0; i < innerIterations; i += 1) {
      if (!this.verifyResult(this.benchmark())) {
        return false;
      }
    }
    return true;
  }

  benchmark(): i32 {
    const result = this.tail(this.makeList(15), this.makeList(10), this.makeList(6));
    if (result === null) {
      panic("List: tail returned an empty list");
    }
    return result.length();
  }

  makeList(length: i32): Element | null {
    if (length === 0) {
      return null;
    }
    const e = new Element(length);
    e.next = this.makeList(length - 1);
    return e;
  }

  isShorterThan(x: Element | null, y: Element | null): boolean {
    let xTail = x;
    let yTail = y;

    while (yTail !== null) {
      if (xTail === null) {
        return true;
      }
      xTail = xTail.next;
      yTail = yTail.next;
    }
    return false;
  }

  tail(x: Element | null, y: Element | null, z: Element | null): Element | null {
    if (this.isShorterThan(y, x)) {
      // The JavaScript version dereferences these unchecked; Nish makes the
      // null check explicit, which is what the VM does implicitly there.
      if (x === null || y === null || z === null) {
        panic("List: tail reached an empty list");
      }
      return this.tail(this.tail(x.next, y, z), this.tail(y.next, z, x), this.tail(z.next, x, y));
    }
    return z;
  }

  verifyResult(result: i32): boolean {
    return 10 === result;
  }
}
