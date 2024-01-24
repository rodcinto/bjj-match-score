export default class Pile {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.items.length === 0) {
      return 0;
    }
    return this.items.pop();
  }

  size() {
    return this.items.length;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  searchAndDestroy(type) {
    let filterLogic = (item) => item.type !== type;
    if(Array.isArray(type)) {
      filterLogic = (item) => !type.includes(item.type);
    }

    this.items = this.items.filter(filterLogic);
  }

  clear() {
    this.items = [];
  }

  [Symbol.iterator]() {
    let index = this.items.length - 1;

    return {
      next: () => {
        if (index >= 0) {
          return { value: this.items[index--], done: false };
        } else {
          return { done: true };
        }
      },
    };
  }
}
