'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { Avatar } from '@nextui-org/avatar'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Modal, ModalBody, ModalContent } from '@nextui-org/modal'
import { Spinner } from '@nextui-org/spinner'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table'
import { FaEye } from 'react-icons/fa'
import { MdOutlineNotificationsActive } from 'react-icons/md'
import { notificationEndpoint, userClassEndpoint } from '@/config/endpoints'
import { updateSearchParams } from '@/helper/logics'
import useDebounce from '@/hooks/useDebounce'
import { useGet } from '@/hooks/useGet'
import { useMutation } from '@/hooks/useMutation'
import { IClass, IUser } from '@/types'
import SendNotification from '@/components/common/SendNotification'
import { Role } from '@/helper/enums'

const USE_MOCK = true // ⚡️ Chuyển = false để dùng API thật

const cols: { key: string; label: string }[] = [
  { key: 'no', label: 'No' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'code', label: 'Code' },
  { key: 'class', label: 'Class' },
  { key: 'action', label: '' },
]

// MOCK DATA
const mockStudents: { user: IUser; class_instance: IClass }[] = [
  {
    user: {
      id: '1',
      username: 'nguyenvana',
      full_name: 'Nguyen Van A',
      role: Role.STUDENT,
      email: 'a@example.com',
      code: 'SV001',
      avatar: '',
      gender: 'MALE',
      date_of_birth: '2000-01-01',
      date_joined: '2023-09-01',
      phone_number: '0123456789',
      address: 'Hanoi',
    },
    class_instance: {
      id: '101',
      name: 'Class 10A1',
      key: '10A1',
      year: 2023,
      student_count: 40,
      teacher: null,
    },
  },
  {
    user: {
      id: '2',
      username: 'tranthib',
      full_name: 'Tran Thi B',
      role: Role.STUDENT,
      email: 'b@example.com',
      code: 'SV002',
      avatar: '',
      gender: 'FEMALE',
      date_of_birth: '2001-02-02',
      date_joined: '2023-09-01',
      phone_number: '0987654321',
      address: 'HCM',
    },
    class_instance: {
      id: '102',
      name: 'Class 11B',
      key: '11B',
      year: 2023,
      student_count: 35,
      teacher: null,
    },
  },
]

export default function ListStudent() {
  const params = useParams()
  const id = params?.id as string | undefined
  const searchParams = useSearchParams()
  const search = searchParams.get('search') || ''
  const [selectedStudent, setSelectedStudent] = useState<null | IUser>(null)
  const [inputSearch, setInputSearch] = useState(search)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const searchDebounce = useDebounce(inputSearch)
  const router = useRouter()

  // 🔹 API thật (chỉ chạy nếu USE_MOCK = false)
  const { response, pending } = useGet<{ count: number; results: { user: IUser; class_instance: IClass }[] }>(
    {
      url: userClassEndpoint.BASE,
      config: {
        params: {
          search,
          class_id: id,
        },
      },
    },
    {
      deps: [search, id],
      disabled: USE_MOCK, // ✅ Không gọi API nếu đang mock
    },
  )

  // 🔹 Chọn dữ liệu hiển thị
  const students = USE_MOCK ? mockStudents : response?.results || []
  const loading = USE_MOCK ? false : pending

  const sendNotificationMutation = useMutation()

  useEffect(() => {
    if (!USE_MOCK) {
      router.replace(updateSearchParams({ search: searchDebounce }))
    }
  }, [searchDebounce])

  const handleSendNotification = async ({ title, description }: { title: string; description: string }) => {
    const formdata = new FormData()
    formdata.append('title', title)
    formdata.append('detail', description)
    if (selectedStudents.length) {
      selectedStudents.forEach((id) => formdata.append('student_ids', id))
    } else {
      formdata.append('all_students', 'true')
    }

    const { error } = await sendNotificationMutation.mutation({
      url: notificationEndpoint.BASE,
      method: 'post',
      body: formdata,
    })

    if (error) {
      toast.error(error?.data?.response?.detail || 'Can not send notification')
      return
    }

    toast.success('Notification sent')
    setIsOpen(false)
  }

  return (
    <div className="mt-10">
      {/* 🔍 Search + Notification */}
      <div className="grid grid-cols-4 gap-5">
        <Input
          color="primary"
          label="Search"
          placeholder="Name/Email"
          size="sm"
          variant="bordered"
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
        />
        <Button color="primary" isIconOnly size="lg" className="text-lg" onClick={() => setIsOpen(true)}>
          <MdOutlineNotificationsActive />
        </Button>
      </div>

      {/* 📝 Table */}
      <Table
        isStriped
        aria-label="Student-list"
        selectionMode="multiple"
        className="mt-4"
        selectedKeys={selectedStudents}
        onSelectionChange={(keys) => {
          if (keys === 'all') setSelectedStudents(students.map((student) => student.user.id))
          else setSelectedStudents(Array.from(keys) as string[])
        }}
      >
        <TableHeader columns={cols}>
          {(col) => (
            <TableColumn key={col.key} align="center">
              {col.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody loadingContent={<Spinner />} isLoading={loading}>
          {students.map((student, index) => (
            <TableRow key={student.user.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{student.user.full_name}</TableCell>
              <TableCell>{student.user.email}</TableCell>
              <TableCell>{student.user.code}</TableCell>
              <TableCell>{student.class_instance.name}</TableCell>
              <TableCell>
                <div className="flex justify-center gap-1">
                  <Button isIconOnly color="primary" variant="flat" onClick={() => setSelectedStudent(student.user)}>
                    <FaEye className="text-lg" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 👤 Modal Info */}
      <Modal isOpen={!!selectedStudent} onOpenChange={(isOpen) => !isOpen && setSelectedStudent(null)}>
        <ModalContent>
          <ModalBody>
            <Avatar
              src={selectedStudent?.avatar || undefined}
              name={selectedStudent?.full_name}
              className="mx-auto w-40 aspect-square h-40 text-4xl"
              showFallback
            />
            <div className="mt-4">
              <p className="text-4xl font-semibold text-center">{selectedStudent?.full_name}</p>
              <p className="mt-2">Email: {selectedStudent?.email}</p>
              <p className="mt-2">Student code: {selectedStudent?.code}</p>
              <p className="mt-1">Phone: {selectedStudent?.phone_number}</p>
              <p className="mt-1">Gender: {selectedStudent?.gender}</p>
              <p className="mt-1">Address: {selectedStudent?.address}</p>
              <p className="mt-1">DOB: {selectedStudent?.date_of_birth}</p>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* 🔔 Send Notification */}
      <SendNotification
        isOpen={isOpen}
        loading={sendNotificationMutation.pending}
        title={
          <>
            Send notification to {selectedStudents.length ? 'selected' : <span className="text-blue-500">ALL</span>}{' '}
            Students
          </>
        }
        onOpenChange={(isOpen) => !isOpen && !sendNotificationMutation.pending && setIsOpen(false)}
        onSubmit={handleSendNotification}
      />
    </div>
  )
}
