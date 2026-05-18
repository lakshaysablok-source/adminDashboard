import { Injectable } from '@angular/core';
  import { of } from 'rxjs';
  import { delay } from 'rxjs/operators';

  @Injectable({ providedIn: 'root' })
  export class MockDataService {
    getStats() {
      return of({
        revenue:    { value: '$84,520', delta: +12.5 },
        users:      { value: '24,310',  delta: +8.1  },
        sessions:   { value: '1,892',   delta: -2.4  },
        conversion: { value: '3.24%',   delta: +0.6  },
      }).pipe(delay(600));
    }

    getRevenueChart() {
      const labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return of({
        labels,
        current:  [32,48,38,62,55,78,65,88,72,94,85,105],
        previous: [28,35,32,48,42,60,55,70,58,78,68,88],
      }).pipe(delay(400));
    }

    getTrafficSources() {
      return of({
        labels: ['Organic','Direct','Referral','Social','Email'],
        data:   [42, 28, 14, 10, 6],
      }).pipe(delay(400));
    }

    getTransactions() {
      return of([
        { id:'#4521', user:'Sarah Miller',  amount:'$240.00', status:'completed', date:'2024-01-15' },
        { id:'#4520', user:'James Wilson',  amount:'$180.50', status:'pending',   date:'2024-01-15' },
        { id:'#4519', user:'Emma Davis',    amount:'$95.00',  status:'completed', date:'2024-01-14' },
        { id:'#4518', user:'Liam Brown',    amount:'$320.75', status:'failed',    date:'2024-01-14' },
        { id:'#4517', user:'Olivia Garcia', amount:'$155.00', status:'completed', date:'2024-01-13' },
      ]).pipe(delay(500));
    }
  }