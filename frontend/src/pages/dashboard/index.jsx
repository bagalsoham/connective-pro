import { getAllPost } from '@/config/redux/action/postAction';
import { getAboutUser } from '@/config/redux/action/authAction';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '@/layout/DashboardLayout';

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  // ✅ Declare the state
  const [isTokenThere, setIsTokenThere] = useState(false);

  // ✅ Check token existence
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsTokenThere(true);
    }
  }, []);

  // ✅ Once token is confirmed, dispatch actions
  useEffect(() => {
    if (isTokenThere) {
      const token = localStorage.getItem('token');
      dispatch(getAllPost());
      dispatch(getAboutUser({ token }));
    }
  }, [isTokenThere, dispatch]);

  return (
    <UserLayout>
      <DashboardLayout>
        <h1>dashboard</h1>
      </DashboardLayout>
    </UserLayout>
  );
}
