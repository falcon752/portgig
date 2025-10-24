export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '')
  return cleaned.startsWith('0') || cleaned.startsWith('234') ? cleaned : `0${cleaned}`
}