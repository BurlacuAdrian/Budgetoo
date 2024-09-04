import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useDeviceType from '../../Hooks/useDeviceType';

const InviteResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get('status');
  const reason = queryParams.get('reason');
  const [countdown, setCountdown] = useState(6);

  let message;
  if (status === 'success') {
    message = 'Invitation accepted! Welcome to the family.';
  } else {
    switch (reason) {
      case 'missing_token':
        message = 'Failed to accept invite. Token is missing.';
        break;
      case 'invalid_token':
        message = 'Failed to accept invite. The token is invalid.';
        break;
      case 'user_not_found':
        message = 'Failed to accept invite. Sender or receiver not found.';
        break;
      case 'already_in_family':
        message = 'Failed to accept invite. Receiver is already part of another family.';
        break;
      case 'internal_error':
        message = 'Failed to accept invite due to an internal server error.';
        break;
      default:
        message = 'Failed to accept invite. Please try again later.';
        break;
    }
  }

  // Start the countdown and redirect after 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate('/login');
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  const device = useDeviceType();

  const RenderContent = () => (
    <div className="flex flex-col items-center pt-6 px-8">
      <div className="relative w-full flex items-start">
        <span className="absolute w-full text-center font-bold text-xl">{status === 'success' ? 'Success!' : 'Error'}</span>
      </div>
      <div className="grid grid-cols-3 w-full p-4 mt-8 gap-6">
        <span className="text-3xl col-span-3 flex items-center font-bold">{message}</span>
      </div>
      <div className="mt-8 text-center text-lg">
        Redirecting to login in {countdown} seconds...
      </div>
    </div>
  );

  if (device.type === 'mobile') {
    return (
      <div className="bg-primaryBudgetoo h-[100dvh] w-[100dvw] flex flex-col">
        <div className="h-[30%] flex justify-center items-center">
          <div className="text-white text-3xl font-bold">Budgetoo</div>
        </div>
        <div className="bg-white w-full h-[90%] mt-auto rounded-t-[4rem]">
          <RenderContent />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primaryBudgetoo h-[100dvh] w-[100dvw] flex flex-col">
      <div className="h-[30%] flex justify-center items-center">
        <div className="text-white text-3xl font-bold">Budgetoo</div>
      </div>
      <div className="bg-white w-1/3 h-[90%] mt-auto rounded-t-[4rem] self-center">
        <RenderContent />
      </div>
    </div>
  );
};

export default InviteResult;
