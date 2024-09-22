import 'dayjs/locale/pt-br'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import weekday from 'dayjs/plugin/weekday'

dayjs.extend(weekday)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Sao_Paulo')

dayjs.locale('pt-br')
dayjs.extend(customParseFormat)

const customDayjs = dayjs.tz

export { customDayjs }
