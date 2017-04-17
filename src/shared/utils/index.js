export const cropNumber = num =>
  Number((num).toFixed(8))

export const formatDate = time => {
  const date = new Date(time)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const hoursStr = hours.toString().length > 1 ? hours : `0${hours}`
  const minutesStr = minutes.toString().length > 1 ? minutes : `0${minutes}`
  return `${hoursStr}:${minutesStr}`
}
