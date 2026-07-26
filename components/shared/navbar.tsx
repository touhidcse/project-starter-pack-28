'use client'

import Link from 'next/link'
import { LogOut, Settings, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DropdownMenuLabel } from 'radix-ui/dropdown-menu'

// Navigation items configuration
const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
]

// User dropdown menu items
const userMenuItems = [
  { label: 'Profile', icon: User, action: 'profile' },
  { label: 'Settings', icon: Settings, action: 'settings' },
]

type Iuser = {
    success: boolean,
    message: string,
    data: {
        profile: {
            id: string,
            name: string,           
            email: string,
            activeStatus: string,
            role: string,
            createdAt: string,
            updatedAt: string,
            profile: {
                id: string,
                profilePhoto: string,
                bio: string,
                userId: string,
                createdAt: string,
                updatedAt: string
            }
        }
    }


}
type NavbarProps ={
  user: Iuser 
}


export function Navbar({user}: NavbarProps) {
  const handleUserAction = (action: string) => {
    console.log(`User clicked: ${action}`)
    // Add your action logic here
  }

  return (
    <nav className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">NextJS Press</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-foreground rounded-md hover:bg-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className='cursor-pointer'>
                <User className="w-4 h-4 mr-2" />
                {/* Account */}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                    <div className='flex flex-col gap 1'>
                        <p className='text-sm font-medium'>{user.data?.profile.name || "Name"}</p>
                        <p className='text-xs text-muted-foreground'>{user.data?.profile.email || "Email"}</p>
                    </div>
                </DropdownMenuLabel>
              <DropdownMenuGroup>
                {userMenuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <DropdownMenuItem
                      key={item.action}
                      onClick={() => handleUserAction(item.action)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleUserAction('logout')}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
