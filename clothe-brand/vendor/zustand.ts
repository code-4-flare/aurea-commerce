"use client";

import { useSyncExternalStore } from "react";

type SetState<T> = (partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => void;
type GetState<T> = () => T;
type Listener = () => void;

export function create<T>(initializer: (set: SetState<T>, get: GetState<T>) => T) {
  let state: T;
  const listeners = new Set<Listener>();

  const setState: SetState<T> = (partial, replace = false) => {
    const nextPartial = typeof partial === "function" ? partial(state) : partial;
    state = replace ? (nextPartial as T) : { ...state, ...nextPartial };
    listeners.forEach(listener => listener());
  };

  const getState: GetState<T> = () => state;
  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  state = initializer(setState, getState);

  function useStore<U>(selector: (state: T) => U): U;
  function useStore(): T;
  function useStore<U>(selector?: (state: T) => U) {
    return useSyncExternalStore(
      subscribe,
      () => (selector ? selector(state) : state),
      () => (selector ? selector(state) : state),
    );
  }

  useStore.getState = getState;
  useStore.setState = setState;
  useStore.subscribe = subscribe;

  return useStore;
}
