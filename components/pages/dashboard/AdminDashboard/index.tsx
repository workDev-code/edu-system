import { statisticEndpoint } from '@/config/endpoints'
import { useGet } from '@/hooks/useGet'
import Block from './Block'

interface Statistic {
  total_students: number
  total_teachers: number
  total_users: number
  total_classes: number
  total_subjects: number
}

export default function AdminDashboard() {
  // const { response } = useGet<Statistic>({
  //   url: statisticEndpoint.BASE,
  // })

  // Nếu chưa có backend thì ta cho 1 response giả fallback
  const fakeResponse: Statistic = {
    total_students: 120,
    total_teachers: 25,
    total_users: 145,
    total_classes: 12,
    total_subjects: 8,
  }

  return (
    <div className="mt-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Block label="Total students" value={fakeResponse?.total_students} />
        <Block label="Total teachers" value={fakeResponse?.total_teachers} />
        <Block label="Total classes" value={fakeResponse?.total_classes} />
        <Block label="Total subjects" value={fakeResponse?.total_subjects} />
      </div>
    </div>
  )
}
