import { Navbar } from '@/components/shared/navbar'
import { getMe } from '@/service/getMe';
import React from 'react'

const AuthGroupLayout = async(
    {
        children
    }:{
        children: React.ReactNode
    }
) => {
  const user = await getMe();
  return (
    
    <div className='maw-w-7xl mx-auto'>
      <Navbar user={user}/>
    {children}
    </div>
  )
}

export default AuthGroupLayout