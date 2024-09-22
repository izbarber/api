export class ConflictException extends Error {
  constructor(message?: string) {
    super(message ?? 'Conflict exception')
  }
}
