export class StoreBranch<Data, Params = null, Error extends any = null> {
  public data: Data | null;
  public params: Params | null;
  public errors: Error | null;
  public loading: boolean;

  constructor(data: Data | null = null, params: Params | null = null, errors: Error | null = null, loading: boolean = false) {
    this.data = data;
    this.params = params;
    this.errors = errors;
    this.loading = loading;
  }
}
