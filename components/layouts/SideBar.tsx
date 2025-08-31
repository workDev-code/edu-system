'use client'

import { useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { Tab, Tabs } from '@nextui-org/tabs'

import { RootState } from '@/redux'
import { Role } from '@/helper/enums'
import { adminNavs, studentNavs, teacherNavs } from '@/helper/datas'
import logo from '@/public/images/logo1.png'
import logoMini from '@/public/images/logo1.png'
import { motion } from 'framer-motion'
interface Props {
  collapsed: boolean
}

export default function SideBar({ collapsed }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.auth)

  const navs = useMemo(() => {
    if (user?.role === Role.ADMIN) return adminNavs
    if (user?.role === Role.TEACHER) return teacherNavs
    if (user?.role === Role.STUDENT) return studentNavs

    return []
  }, [user?.role])

  return (
    <aside
      className="h-full shrink-0 duration-200 ease-in-out shadow-md bg-white"
      style={{
        width: collapsed ? 70 : 250,
      }}
    >
      <div className="h-20 flex items-center justify-center">
        <Image
          src={collapsed ? logoMini : logo}
          alt="Logo"
          height={80} // ~ h-20
          className="object-contain"
        />
      </div>

      <Tabs
        isVertical
        className="w-full overflow-x-hidden mt-5"
        classNames={{
          tabList: 'w-full p-0 bg-white',
          tabContent: 'w-full',
        }}
        radius="none"
        selectedKey={
          pathname === '/' ? '/' : navs.find((nav) => nav.href !== '/' && pathname.startsWith(nav.href))?.href
        }
        size="lg"
        onSelectionChange={(key) => router.push(key + '')}
      >
        {navs.map((nav) => (
          <Tab
            key={nav.href}
            className="bg-white py-3 h-[unset] [&>span]:bg-slate-200"
            title={
              <div
                className={`flex items-center w-full duration-200 ${collapsed ? 'justify-center gap-0' : 'justify-start gap-2 '}`}
              >
                <nav.icon className="text-lg shrink-0 duration-200" />{' '}
                <motion.span
                  initial={false}
                  animate={collapsed ? { opacity: 0, maxWidth: 0 } : { opacity: 1, maxWidth: 200 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="block text-left overflow-hidden whitespace-nowrap text-blue-500"
                >
                  {nav.label}
                </motion.span>
              </div>
            }
          />
        ))}
      </Tabs>
    </aside>
  )
}
