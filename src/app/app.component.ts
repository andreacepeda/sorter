import { Component, ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  randomNumbers: number[] = [];
  compareIndex1: number | null = null;
  compareIndex2: number | null = null;
  isSorting: boolean = false;
  currentState: string = '';

  generateUniqueRandomNumbers(): void {
    const maxNumbers = 20;
    const maxRange = 40;

    const numbersSet = new Set<number>();

    while (numbersSet.size < maxNumbers) {
      const randomNumber = Math.floor(Math.random() * maxRange) + 1;
      numbersSet.add(randomNumber);
    }

    this.randomNumbers = Array.from(numbersSet);
    console.log('Generated Unique Random Numbers:', this.randomNumbers);
  }

  beginMergeSorting(): void {
    this.isSorting = true;
    this.mergeSort(this.randomNumbers, 500).then(() => {
      this.isSorting = false;
      this.compareIndex1 = null;
      this.compareIndex2 = null;
    });
  }

  mergeSort(arr: number[], delay = 0): Promise<number[]> {
    if (arr.length <= 1) return Promise.resolve(arr);

    const middle = Math.floor(arr.length / 2);
    const leftPromise = this.mergeSort(arr.slice(0, middle), delay);
    const rightPromise = this.mergeSort(arr.slice(middle), delay);

    return Promise.all([leftPromise, rightPromise]).then(([left, right]) => this.merge(left, right, delay));
  }

  merge(left: number[], right: number[], delay: number): Promise<number[]> {
    return new Promise((resolve) => {
      let result: number[] = [];
      let leftIndex = 0;
      let rightIndex = 0;

      const mergeStep = () => {
        if (leftIndex < left.length && rightIndex < right.length) {
          this.compareIndex1 = leftIndex;
          this.compareIndex2 = rightIndex;

          if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
          } else {
            result.push(right[rightIndex]);
            rightIndex++;
          }

          if (this.compareIndex1 !== null) {
            this.randomNumbers.splice(this.compareIndex1, 1, result[result.length - 1]);
          }

          setTimeout(mergeStep, delay);
        } else {
          result = result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
          this.randomNumbers.splice(0, this.randomNumbers.length, ...result);

          this.compareIndex1 = null;
          this.compareIndex2 = null;

          resolve(result);
        }
      };

      mergeStep();
    });
  }

  beginQuickSorting(): void {
    this.isSorting = true;
    this.quickSort(this.randomNumbers, 0, this.randomNumbers.length - 1, 100)
      .then(() => {
        console.log('Quick Sort Complete');
        this.isSorting = false;
        this.compareIndex1 = null;
        this.compareIndex2 = null;
      })
      .catch(err => {
        console.error('Quick Sort Error:', err);
        this.isSorting = false;
      });
  }

  private quickSort(arr: number[], low: number, high: number, delay: number): Promise<void> {
    if (low < high) {
      return this.partition(arr, low, high, delay)
        .then(pi => Promise.all([
          this.quickSort(arr, low, pi - 1, delay),
          this.quickSort(arr, pi + 1, high, delay)
        ]))
        .then(() => undefined);
    } else {
      return Promise.resolve();
    }
  }

  private partition(arr: number[], low: number, high: number, delay: number): Promise<number> {
    const pivot = arr[high];
    let i = low - 1;

    const processPartition = (j: number): Promise<number> => {
      if (j < high) {
        this.compareIndex1 = j;
        this.compareIndex2 = i + 1;

        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        this.randomNumbers = [...arr];
        return this.delay(delay).then(() => processPartition(j + 1));
      } else {
        this.compareIndex1 = i + 1;
        this.compareIndex2 = high;
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

        this.randomNumbers = [...arr];
        return this.delay(delay).then(() => Promise.resolve(i + 1));
      }
    };

    return processPartition(low);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
