import { useEffect } from "react";
import { useRouter } from "next/router";
import { client } from "@/lib/client";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import toast from "react-hot-toast";

const Success = () => {
  const router = useRouter();
  const { booking } = router.query;

  useEffect(() => {
    let timer;
  
    if (booking) {
      const fetchBookingAndRedirect = async () => {
        try {
          const bookingFetch = await client.fetch(
            `*[_type == "booking" && uniqueBookingId == $booking][0]`,
            { booking }
          );
  
          const ticketId = bookingFetch?._id;
  
          timer = setTimeout(() => {
            router.push(`/ticket/${booking}?data=${ticketId}`);
          }, 1500);
        } catch (error) {
          toast.error(error, {
            style: {
              borderRadius: "1000px",
              background: "#B03C3F",
              color: "#fff",
            },
          });
          // router.push('/');
        }
      };
  
      fetchBookingAndRedirect();
    }
  
    return () => clearTimeout(timer);
  }, [booking, router]);

  return (
    <div className="p-25 h-[100vh] text-amber-50 flex flex-col justify-center items-center">
      <h1 className="text-xl font-bold pb-10">
        Your ticket was reserved successfully
      </h1>
      <div className="flex flex-row items-center justify-center gap-5">
        <AiOutlineLoading3Quarters size={20} className="animate-spin" />
        <p className="text-sm text-[#d3d3d3]">
          You&apos;ll be redirected to the ticket page...
        </p>
      </div>
    </div>
  );
};

export default Success;
