import { Injectable } from '@angular/core';

@Injectable()
export class LogService {

  constructor() { }

  w(s: string) {
    console.warn(s)
  }
}
