export {}

declare global {
    interface Window {
        importFile(): void
        sendValue(...args: any[]): void
        closeClient(): void
    }
}
