const rx = require("rxjs");
const rxFetch = require("rxjs/fetch");
const rxOps = require("rxjs/operators");

// Number ops

const { range, from, timer, of } = rx
const { fromFetch } = rxFetch
const { map, filter, pluck, distinct, mergeMap, switchMap, catchError } = rxOps
const { log } = console

const isEven = x => x % 2 === 1;
const doubleNum = x => x + x;

range(1, 4)
    .pipe(
        filter(isEven),
        map(doubleNum)
    )
    .subscribe(log);

// Object handling

const data = [
    { id: 1, price: 15, opt: 'optional' },
    { id: 2, price: 20, opt: 'optional' },
    { id: 3, price: 25, opt: 'optional' },
    { id: 1, price: 15, opt: 'optional' },
    { id: 2, price: 20, opt: 'optional' },
    { id: 3, price: 25, opt: 'optional' },
]

from(data)
    .pipe(
        filter(({price}) => price > 20),
        map(({id, price}) => ({ id, price })),
        pluck('id'),
        distinct()
    )
    .subscribe(log);

// Promise rejection

const xOf = x => of(x)

const myBadPromise = () =>
    new Promise((resolve, reject) => reject('Rejected!'));

const example = timer(200).pipe(
    mergeMap(x => {
            return from(myBadPromise())
                .pipe(catchError(xOf))
        }
    )
);

const subscribe = example.subscribe(log);

// Read

const data$ = fromFetch('https://api.github.com/users?per_page=5').pipe(
    switchMap(response => {
        if (response.ok) {
            // OK return data
            return response.json();
        } else {
            // Server is returning a status requiring the client to try something else.
            return of({ error: true, message: `Error ${response.status}` });
        }
    }),
    catchError(err => {
        // Network or other error, handle appropriately
        console.error(err);
        return of({ error: true, message: err.message })
    })
);

data$.subscribe({
    next: result => console.log(result),
    complete: () => console.log('done')
});