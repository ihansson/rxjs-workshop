const rx = require("rxjs");
const rxOps = require("rxjs/operators");

// Number ops

const { range, from, timer, of } = rx
const { map, filter, pluck, distinct, mergeMap, catchError } = rxOps
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

const source = timer(1000);

const example = source.pipe(
    mergeMap(_ =>
        from(myBadPromise())
            .pipe(catchError(xOf))
    )
);

const subscribe = example.subscribe(log);