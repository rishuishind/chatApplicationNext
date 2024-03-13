import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React, { FC } from 'react'

interface DashboardProps {}

const Dashboard = async ({}) => {
    const session = await getServerSession(authOptions);
  return (
    <pre>Dashboard</pre>
  )
}

export default Dashboard