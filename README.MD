# Product Explorer Performance Repair

This app demonstrates the performance patterns that matter for a product catalog:

- memoizing the derived product list when search, category, and sorting inputs change
- keeping selection handlers stable with `useCallback`
- avoiding unnecessary work by wrapping the list in `React.memo`
- moving analytics side effects out of `useMemo` and into `useEffect`

## When memoization is unnecessary

Memoization is not helpful when the work is simple and the result is cheap to recompute. For example, a tiny `const activeCount = items.length` or a simple string transformation shown below does not require `useMemo` because the cost is negligible and the result will be recalculated on every render anyway:

```js
const label = `${selectedCategory} (${items.length} items)`
```

In that case, the value is inexpensive to compute, and forcing extra memoization adds maintenance complexity without measurable benefit.

## Debugging cases covered

1. Add the missing `query` dependency to the filtered list calculation.
2. Add the missing `sortOrder` / `selectedCategory` dependency to the derived list.
3. Move analytics from `useMemo` into `useEffect` so the code remains side-effect free.
