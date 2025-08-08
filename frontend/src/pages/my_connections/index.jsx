import React from 'react'
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '@/layout/DashboardLayout';

export default function MyConnectionsPage() {
  return (
    <UserLayout>
            <DashboardLayout>
                <h1>my connections</h1>
            </DashboardLayout>
        </UserLayout>
  )
}
