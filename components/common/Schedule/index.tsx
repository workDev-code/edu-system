import { twMerge } from 'tailwind-merge'
import { daysOfWeek, lessions } from '@/config/constants'
import { ISchedule, TDayOfWeek } from '@/types'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { Role } from '@/helper/enums'

interface Props {
  className?: string
  schedules: ISchedule[]
}

export default function Schedule({ className, schedules }: Props) {
  const { user } = useSelector((state: RootState) => state.auth)

  const getSchedule = (day: TDayOfWeek, lession: number) => {
    return schedules.find((_schedule) => _schedule.day_of_week === day && lession === _schedule.period)
  }

  return (
    <div className={twMerge('grid grid-cols-8 bg-white rounded-xl overflow-hidden shadow-md border', className)}>
      {['--', ...daysOfWeek].map((day, dayIndex) => (
        <div key={day} className="flex flex-col">
          {/* Header cột */}
          <div
            className={twMerge(
              'text-center font-semibold py-2 border-b',
              day === '--' ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-600',
            )}
          >
            {day}
          </div>

          {/* Các tiết học */}
          {lessions.map((lession) => {
            if (day === '--') {
              return (
                <div
                  key={lession}
                  className="text-center h-12 flex items-center justify-center border text-gray-500 text-sm bg-gray-50"
                >
                  {lession}
                </div>
              )
            }

            const schedule = getSchedule(day as TDayOfWeek, lession)

            if (!schedule) {
              return (
                <div
                  key={lession}
                  className="h-12 border flex items-center justify-center bg-white hover:bg-gray-50 transition-colors"
                ></div>
              )
            }

            return (
              <div
                key={lession}
                className="h-12 border flex flex-col items-center justify-center text-xs sm:text-sm bg-green-100 hover:bg-green-200 transition-colors font-medium px-1 text-center"
              >
                {/* Nếu là Teacher: hiện tên lớp - môn */}
                {user?.role === Role.TEACHER && (
                  <>
                    <span className="text-green-800">{schedule.class_subject.class_instance.name}</span>
                    <span className="text-gray-700">{schedule.class_subject.subject.name}</span>
                  </>
                )}

                {/* Nếu là Student: hiện môn - GV */}
                {user?.role === Role.STUDENT && (
                  <>
                    <span className="text-green-800">{schedule.class_subject.subject.name}</span>
                    <span className="text-gray-700">
                      {schedule.class_subject.teacher_id?.full_name
                        ? `${schedule.class_subject.teacher_id.full_name.charAt(
                            0,
                          )}.${schedule.class_subject.teacher_id.full_name.split(' ').pop()}`
                        : ''}
                    </span>
                  </>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
