
export async function catchError<T>(promise: Promise<T>): Promise<[T | undefined, Error | undefined]> {
    try {
      const data = await promise;
      return [data, undefined] as [T, undefined];
    } catch (err) {
      return [undefined, err] as [undefined, Error];
    }
}
