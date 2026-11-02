type TypedListener<E extends Event> = (event: E) => void;

export class TypedEventTarget<M extends Record<string, unknown>> {
  private readonly target = new EventTarget();

  addEventListener<K extends keyof M>(
    type: K & string,
    listener: TypedListener<CustomEvent<M[K]>>,
    options?: boolean | AddEventListenerOptions,
  ) {
    this.target.addEventListener(type, listener as EventListenerOrEventListenerObject, options);
  }

  removeEventListener<K extends keyof M>(
    type: K & string,
    listener: TypedListener<CustomEvent<M[K]>>,
    options?: boolean | EventListenerOptions,
  ) {
    this.target.removeEventListener(type, listener as EventListenerOrEventListenerObject, options);
  }

  dispatchEvent<K extends keyof M>(type: K & string, detail: M[K]) {
    return this.target.dispatchEvent(new CustomEvent<M[K]>(type, { detail }));
  }
}
