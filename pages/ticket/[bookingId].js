import React, { useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import TicketData from '@/components/TicketData';

const TicketDetails = () => {
  const router = useRouter();
  const currentUrl = router.asPath;
  return (
    <div className='w-full h-[100vh]'>
      <TicketData />
    </div>
  );
};

export default TicketDetails;
