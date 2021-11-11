export function env<T>(key: string, defaultValue: T): T {
    return (process.env[key]) as any ?? defaultValue;
}