export function generatePassword(length: number = 8): string {
  const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const specialChars = '!@#$%^&*()_+~`|}{[]:;?><,./-='

  const finalLength = Math.max(length, 8)

  const allChars = upperCaseChars + lowerCaseChars + numbers + specialChars
  let password = ''

  for (let i = 0; i < finalLength; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length)
    password += allChars[randomIndex]
  }

  return password
}
