
export const binaryFunc = (fn: (a: number b:) => number) => <T>(zSetA: ZSetObj<T>)

export const pwBinaryFunc =
	(f: (x: number, y: number) => number) =>
	<T>(zSetA: ZSetObj<T>) =>
	(zSetB: ZSetObj<T>) => {
		const result = make<T>();

		// Add all keys from first ZSet
		forEach(zSetA)((value, key) => {
			append(result)(key, value);
		});

		// Add or update with values from second ZSet
		forEach(zSetB)((value, key) => {
			const existingValue = get(result)(key) || 0;
			const newValue = f(existingValue, value);
			append(result)(key, newValue);
		});

		return result;
	};
