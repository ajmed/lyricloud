export class LyracloudEvent<T> {

  handlers = []

  change(oldVal: T, newVal: T) {
    this.handlers.forEach(it => it(oldVal, newVal))
  }

  addHandler(handler: (oldVal: T, newVal: T) => void) {
    this.handlers.push(handler)
  }

  removeHandler(handler: (oldVal: T, newVal: T) => void) {
    const index = this.handlers.indexOf(handler)
    if (index > -1) {
      this.handlers = this.handlers.splice(index, 1);
    }
  }
}
