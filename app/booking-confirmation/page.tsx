// app/booking-confirmation/page.tsx
'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, Suspense } from 'react'; // Import Suspense
import Navbar from '../components/Navbar'; // Adjust path
import FooterSection from '../components/FooterSection'; // Adjust path

// New component that uses useSearchParams
function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');
  const redirectStatus = searchParams.get('redirect_status');

  const [statusMessage, setStatusMessage] = useState('Processing your booking confirmation...');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [pageTitle, setPageTitle] = useState('Booking Status');

  useEffect(() => {
    if (!redirectStatus) {
      setStatusMessage('Looking for your booking status...');
      setPageTitle('Booking Status');
      setIsSuccess(null); // Or some other appropriate default
      // Optionally, try to fetch status if paymentIntentId is present
      return;
    }

    if (redirectStatus === 'succeeded') {
      setStatusMessage('Your payment was successful and your booking is confirmed! Please check your email for details.');
      setPageTitle('Booking Confirmed!');
      setIsSuccess(true);
    } else if (redirectStatus === 'processing') {
      setStatusMessage('Your payment is processing. We will update you via email shortly.');
      setPageTitle('Booking Processing');
      setIsSuccess(null); // Neutral state
    } else if (redirectStatus === 'requires_payment_method') {
      setStatusMessage('Payment failed. Please try another payment method or contact us for assistance.');
      setPageTitle('Payment Issue');
      setIsSuccess(false);
    } else {
      setStatusMessage('There was an issue processing your booking. Please contact us if you have questions.');
      setPageTitle('Booking Issue');
      setIsSuccess(false);
    }
  }, [paymentIntentId, redirectStatus]); // paymentIntentId added as dependency

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl text-center border-t-4 border-pink-500">
        {isSuccess === true && (
          <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        {isSuccess === false && (
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        {isSuccess === null && ( // For processing state or if redirectStatus is missing
          <svg className="mx-auto h-16 w-16 text-blue-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}

        <h1 className={`text-3xl font-bold ${
            isSuccess === true ? 'text-green-700' :
            isSuccess === false ? 'text-red-700' : 'text-blue-700'
        }`}>
          {pageTitle}
        </h1>
        <p className="text-slate-600 text-lg">{statusMessage}</p>
        {paymentIntentId && <p className="text-xs text-slate-400 mt-2">Ref: {paymentIntentId}</p>}


        <div className="mt-10">
          <Link href="/" className="text-base font-semibold text-pink-600 hover:text-pink-800 transition-colors">
            ← Go back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main page component
export default function BookingConfirmationPage() {
  return (
    <div>
      <Navbar />
      {/* Wrap the component that uses useSearchParams with Suspense */}
      <Suspense fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl text-center border-t-4 border-pink-500">
                <svg className="mx-auto h-16 w-16 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                 </svg>
                <h1 className="text-3xl font-bold text-blue-700">Loading Confirmation...</h1>
                <p className="text-slate-600 text-lg">Please wait while we fetch your booking details.</p>
            </div>
        </div>
      }>
        <BookingConfirmationContent />
      </Suspense>
      <FooterSection />
    </div>
  );
}