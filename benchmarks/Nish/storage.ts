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
// Ported to Nish from the JavaScript version (benchmarks/JavaScript/storage.js).

import { Random } from "./som";

// Nish arrays hold one element type and a type cannot name itself without a
// class, so each inner slot holds an `ArrayTree` wrapping the child array. The
// leaves are still arrays of `null`s, like `new Array(n)` in the JavaScript.
class ArrayTree {
  children: (ArrayTree | null)[];

  constructor(children: (ArrayTree | null)[]) {
    this.children = children;
  }
}

export class Storage {
  count: i32 = 0;

  innerBenchmarkLoop(innerIterations: i32): boolean {
    for (let i = 0; i < innerIterations; i += 1) {
      if (!this.verifyResult(this.benchmark())) {
        return false;
      }
    }
    return true;
  }

  benchmark(): i32 {
    const random = new Random();
    this.count = 0;
    this.buildTreeDepth(7, random);
    return this.count;
  }

  verifyResult(result: i32): boolean {
    return 5461 === result;
  }

  buildTreeDepth(depth: i32, random: Random): (ArrayTree | null)[] {
    this.count += 1;
    if (depth === 1) {
      return new Array<ArrayTree | null>((random.next() % 10) + 1);
    }
    const arr = new Array<ArrayTree | null>(4);
    for (let i = 0; i < 4; i += 1) {
      arr[i] = new ArrayTree(this.buildTreeDepth(depth - 1, random));
    }
    return arr;
  }
}
