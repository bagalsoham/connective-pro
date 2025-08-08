import React, { useEffect } from 'react';
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '@/layout/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPost } from '@/config/redux/action/postAction';
import { getAboutUser } from '@/config/redux/action/authAction';

export default function DiscoverPage() {
  const dispatch = useDispatch(); // ✅ Typo fixed (was 'conmst')
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (authState.isTokenThere && !authState.profileFetched) {
      console.log("AUTH TOKEN");
      const token = localStorage.getItem('token');
      dispatch(getAllPost());
      dispatch(getAboutUser({ token }));
    }
  }, [authState.isTokenThere, authState.profileFetched]); // ✅ Removed dispatch
  return (
    <UserLayout>
      <DashboardLayout>
        <h1>my discover</h1>
      </DashboardLayout>
    </UserLayout>
  );
}
