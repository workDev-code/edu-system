'use client'

import { scheduleEndpoint } from '@/config/endpoints'
import { useGet } from '@/hooks/useGet'
import { ISchedule } from '@/types'
import ScheduleCommon from '@/components/common/Schedule'
import PageTitle from '@/components/common/PageTitle'

// 🔹 Flag để chọn mock hay API
const USE_MOCK = true

// 🔹 Mock data
const mockSchedules: ISchedule[] = [
  {
    id: '1',
    day_of_week: 'MONDAY',
    period: 1,
    created_at: '2025-08-31',
    updated_at: '2025-08-31',
    class_subject: {
      id: 'cs1',
      class_instance: {
        id: '101',
        name: 'Class 10A1',
        key: '10A1',
        year: 2025,
        student_count: 40,
        teacher: null,
      },
      created_at: '2025-08-31',
      updated_at: '2025-08-31',
      status: 'ACTIVE',
      subject: {
        id: 'sub1',
        name: 'Math',
        key: 'MATH',
        grade: '10',
      },
      year: 2025,
      semester: 1,
    },
  },
  {
    id: '2',
    day_of_week: 'TUESDAY',
    period: 2,
    created_at: '2025-08-31',
    updated_at: '2025-08-31',
    class_subject: {
      id: 'cs2',
      class_instance: {
        id: '102',
        name: 'Class 11B',
        key: '11B',
        year: 2025,
        student_count: 35,
        teacher: null,
      },
      created_at: '2025-08-31',
      updated_at: '2025-08-31',
      status: 'ACTIVE',
      subject: {
        id: 'sub2',
        name: 'Physics',
        key: 'PHY',
        grade: '11',
      },
      year: 2025,
      semester: 2,
    },
  },
]

export default function Schedule() {
  // 🔹 Vẫn giữ logic cũ
  const { response } = useGet<{ results: ISchedule[] }>({
    url: scheduleEndpoint.BASE,
  })

  // 🔹 Quyết định dùng dữ liệu nào
  const schedules = USE_MOCK ? mockSchedules : response?.results || []

  return (
    <div>
      <PageTitle title="Schedule" />
      <div>
        <ScheduleCommon schedules={schedules} className="mt-10 max-w-screen-lg mx-auto" />
      </div>
    </div>
  )
}
