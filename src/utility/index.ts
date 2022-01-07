export const randomElement = <T>(arr: ReadonlyArray<T>): T => {
  const randomIndex = Math.floor(Math.random() * arr.length)
  return arr[randomIndex]
}

export type Tuple5<T> = readonly [T, T, T, T, T]

export const zipTuple5 = <T, U, V>(t0: Tuple5<T>, t1: Tuple5<U>, f: (x: T, y: U) => V): Tuple5<V> => {
  return [f(t0[0], t1[0]), f(t0[1], t1[1]), f(t0[2], t1[2]), f(t0[3], t1[3]), f(t0[4], t1[4])]
}

export const mapTuple5 = <T, U>([a, b, c, d, e]: Tuple5<T>, f: (x: T, i: number) => U): Tuple5<U> => [
  f(a, 0),
  f(b, 1),
  f(c, 2),
  f(d, 3),
  f(e, 4),
]

export const isNotNull = <T>(x: T | null): x is T => x !== null
