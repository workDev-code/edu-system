'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@nextui-org/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/dropdown'
import { GoSidebarCollapse } from 'react-icons/go'
import { User } from '@nextui-org/user'
import { RootState } from '@/redux'
import { actionLogout } from '@/redux/slices/auth'
import { Role } from '@/helper/enums'
import { IoNotificationsOutline } from 'react-icons/io5'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { Badge } from '@nextui-org/badge'
import { useGet } from '@/hooks/useGet'
import { notificationEndpoint } from '@/config/endpoints'
import { INotification } from '@/types'
import { Card, CardBody } from '@nextui-org/card'
import { Avatar } from '@nextui-org/avatar'
import { twMerge } from 'tailwind-merge'
import moment from 'moment'
import { Tab, Tabs } from '@nextui-org/tabs'
import { Spinner } from '@nextui-org/spinner'
import { useMutation } from '@/hooks/useMutation'
import ViewNotification from '../common/ViewNotification'
import { API_URL } from '@/config/constants'

interface Props {
  collapsed: boolean
  setCollapsed: Dispatch<SetStateAction<boolean>>
}

export default function Header({ collapsed, setCollapsed }: Props) {
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const router = useRouter()
  const [option, setOption] = useState<'ALL' | 'UNREAD'>('ALL')
  const [selectedNotification, setSelectedNotification] = useState<INotification | null>(null)

  const {
    response: notificationResponse,
    pending,
    reFetch,
  } = useGet<{ results: INotification[]; unread: number }>(
    {
      url: notificationEndpoint.BASE,
      config: { params: { limit: 20, offset: 0, status: option === 'UNREAD' ? false : undefined } },
    },
    { deps: [option] },
  )

  const readNotificationMutation = useMutation()

  const handleClickNotification = async (notification: INotification) => {
    setSelectedNotification(notification)
    if (!notification.status) {
      const formData = new FormData()
      formData.append('status', 'true')
      const { error } = await readNotificationMutation.mutation({
        url: `${notificationEndpoint.BASE}/${notification.id}`,
        method: 'put',
        body: formData,
        config: { headers: { 'Content-Type': 'multipart-formdata' } },
      })
      if (!error) reFetch()
    }
  }

  // Role-based background color
  const headerBg = user?.role === Role.STUDENT ? 'bg-blue-50' : user?.role === Role.TEACHER ? 'bg-green-50' : 'bg-white'

  return (
    <header className={twMerge('h-20 w-full flex items-center justify-between px-6 shadow-sm', headerBg)}>
      {/* Sidebar toggle */}
      <Button
        isIconOnly
        className={twMerge('duration-200', collapsed ? '' : 'rotate-180')}
        color="primary"
        size="sm"
        variant="light"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        <GoSidebarCollapse className="text-black text-lg" />
      </Button>

      <div className="flex items-center gap-4">
        {/* Quick Links */}
        {user?.role === Role.ADMIN && (
          <div className="flex gap-2">
            <Button size="sm" color="primary" onClick={() => router.push('/admin/classes/new')}>
              + Add Class
            </Button>
            <Button size="sm" color="secondary" onClick={() => router.push('/admin/students/new')}>
              + Add Student
            </Button>
          </div>
        )}

        {[Role.STUDENT, Role.TEACHER].includes(user?.role as Role) && (
          <div className="flex gap-2 items-center">
            {user?.role === Role.TEACHER && (
              <Button size="sm" color="primary" onClick={() => router.push('/teacher/classes')}>
                My Classes
              </Button>
            )}
            {user?.role === Role.STUDENT && (
              <Button size="sm" color="secondary" onClick={() => router.push('/student/schedule')}>
                My Schedule
              </Button>
            )}
            <Button size="sm" color="success" onClick={() => router.push('/notifications')}>
              Notifications
            </Button>
          </div>
        )}

        {/* Notifications */}
        {[Role.STUDENT, Role.TEACHER, Role.ADMIN].includes(user?.role as Role) && (
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Button
                isIconOnly
                variant="light"
                className="text-xl"
                title={`${notificationResponse?.unread || 0} unread`}
              >
                <Badge
                  content={notificationResponse?.unread}
                  isInvisible={!notificationResponse?.unread}
                  color="danger"
                  size="sm"
                >
                  <IoNotificationsOutline />
                </Badge>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[360px] max-h-[400px] overflow-auto bg-gray-100 p-2 rounded-md shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-semibold text-purple-900">Notifications</p>
                <div className="flex items-center gap-2">
                  <Tabs
                    size="sm"
                    variant="underlined"
                    selectedKey={option}
                    onSelectionChange={(k) => setOption(k as 'ALL' | 'UNREAD')}
                  >
                    <Tab key="ALL" title="All" />
                    <Tab key="UNREAD" title="Unread" />
                  </Tabs>
                  <Button
                    size="xs"
                    variant="flat"
                    onClick={() => {
                      /* mark all read logic */
                    }}
                  >
                    Mark all read
                  </Button>
                </div>
              </div>

              <div className="relative">
                {pending && (
                  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm z-10">
                    <Spinner />
                  </div>
                )}
                {notificationResponse?.results.map((n) => (
                  <Card
                    key={n.id}
                    isPressable
                    className={twMerge('mb-1 shadow-none', n.status ? 'bg-gray-100' : 'bg-white')}
                    onClick={() => handleClickNotification(n)}
                  >
                    <CardBody className="flex items-center gap-2">
                      <Avatar
                        src={n.sender.avatar ? `${API_URL}${n.sender.avatar}` : undefined}
                        name={n.sender.full_name}
                        showFallback
                      />
                      <div className="flex-1">
                        <h3 className="line-clamp-1 font-medium">{n.title}</h3>
                        <p className="text-[10px] text-gray-500 text-right">
                          {moment(n.created_at).format('HH:mm DD/MM/yyyy')}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* User Dropdown with Greeting */}
        <Dropdown>
          <DropdownTrigger>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden sm:inline">
                Hi, <b>{user?.full_name?.split(' ')[0]}</b>!
              </span>
              <User
                avatarProps={{
                  name: user?.full_name,
                  color: 'success',
                  src: `${API_URL}${user?.avatar}`,
                  showFallback: true,
                }}
                className="border rounded-full p-0.5 cursor-pointer shadow"
                description={user?.role}
                name={user?.full_name}
              />
            </div>
          </DropdownTrigger>
          <DropdownMenu>
            {user?.role === Role.ADMIN && (
              <DropdownSection showDivider>
                <DropdownItem onClick={() => router.push('/admin/dashboard')}>Dashboard</DropdownItem>
                <DropdownItem onClick={() => router.push('/admin/users')}>Manage Users</DropdownItem>
                <DropdownItem onClick={() => router.push('/admin/classes')}>Manage Classes</DropdownItem>
                <DropdownItem onClick={() => router.push('/admin/subjects')}>Manage Subjects</DropdownItem>
              </DropdownSection>
            )}
            {[Role.TEACHER, Role.STUDENT].includes(user?.role as Role) && (
              <DropdownSection showDivider>
                <DropdownItem onClick={() => router.push('/profile')}>Profile</DropdownItem>
              </DropdownSection>
            )}
            <DropdownItem
              color="warning"
              onClick={() => {
                dispatch(actionLogout())
                router.replace('/auth/login')
              }}
            >
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Notification Modal */}
      <ViewNotification
        isOpen={!!selectedNotification}
        onOpenChange={(isOpen) => !isOpen && setSelectedNotification(null)}
        notification={selectedNotification}
      />
    </header>
  )
}
