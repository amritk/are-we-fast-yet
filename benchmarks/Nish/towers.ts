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
// Ported to Nish from the JavaScript version (benchmarks/JavaScript/towers.js).

class TowersDisk {
  size: i32;
  next: TowersDisk | null = null;

  constructor(size: i32) {
    this.size = size;
  }
}

export class Towers {
  piles: (TowersDisk | null)[];
  movesDone: i32 = 0;

  constructor() {
    this.piles = [];
  }

  innerBenchmarkLoop(innerIterations: i32): boolean {
    for (let i = 0; i < innerIterations; i += 1) {
      if (!this.verifyResult(this.benchmark())) {
        return false;
      }
    }
    return true;
  }

  benchmark(): i32 {
    this.piles = new Array<TowersDisk | null>(3);
    this.buildTowerAt(0, 13);
    this.movesDone = 0;
    this.moveDisks(13, 0, 1);
    return this.movesDone;
  }

  verifyResult(result: i32): boolean {
    return 8191 === result;
  }

  pushDisk(disk: TowersDisk, pile: i32): void {
    const top = this.piles[pile];
    if (top !== null && disk.size >= top.size) {
      panic("Cannot put a big disk on a smaller one");
    }

    disk.next = top;
    this.piles[pile] = disk;
  }

  popDiskFrom(pile: i32): TowersDisk {
    const top = this.piles[pile];
    if (top === null) {
      panic("Attempting to remove a disk from an empty pile");
    }

    this.piles[pile] = top.next;
    top.next = null;
    return top;
  }

  moveTopDisk(fromPile: i32, toPile: i32): void {
    this.pushDisk(this.popDiskFrom(fromPile), toPile);
    this.movesDone += 1;
  }

  buildTowerAt(pile: i32, disks: i32): void {
    for (let i = disks; i >= 0; i -= 1) {
      this.pushDisk(new TowersDisk(i), pile);
    }
  }

  moveDisks(disks: i32, fromPile: i32, toPile: i32): void {
    if (disks === 1) {
      this.moveTopDisk(fromPile, toPile);
    } else {
      const otherPile = 3 - fromPile - toPile;
      this.moveDisks(disks - 1, fromPile, otherPile);
      this.moveTopDisk(fromPile, toPile);
      this.moveDisks(disks - 1, otherPile, toPile);
    }
  }
}
