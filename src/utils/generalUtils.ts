export const formatNumberWithCommas = (number: number, language: string): string => {
  return new Intl.NumberFormat(language).format(number) // 'en-US' for US English formatting
}

const decimalToDMS = (decimal: number) => {
  const deg = Math.floor(Math.abs(decimal))
  const minFloat = (Math.abs(decimal) - deg) * 60
  const min = Math.floor(minFloat)
  const sec = ((minFloat - min) * 60).toFixed(2)

  const direction = decimal >= 0 ? 'N' : 'S' // ou E/W para longitude
  return `${deg}° ${min}' ${sec}" ${direction}`
}

export const latLonToDMS = (lat: number, lon: number) => {
  const latDMS = decimalToDMS(lat).replace(/[NS]/, lat >= 0 ? 'N' : 'S')
  const lonDMS = decimalToDMS(lon).replace(/[NS]/, lon >= 0 ? 'E' : 'W')
  return { lat: latDMS, lon: lonDMS }
}
