export class UnprocessableEntityExeception extends Error {
  constructor(message?: string) {
    super(message ?? 'Unprocessable entity exception')
  }
}
