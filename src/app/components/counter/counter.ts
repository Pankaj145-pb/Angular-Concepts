import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { decrement, increment } from '../../store/counter.action';
import { AppStore } from '../../store/counter.reducer';

@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.html',
  styleUrl: './counter.css',
})
export class Counter {

  counterValue: number = 0;

  constructor(private store: Store<AppStore>) {
    this.store.pipe(select('count')).subscribe((value: number) => {
      this.counterValue = value;
    });
  }

  onDecrement() {
    this.store.dispatch(decrement());
  }

  onIncrement() {
    this.store.dispatch(increment());
  }
}
