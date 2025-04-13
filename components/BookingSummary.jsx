import React, { useEffect, useState } from "react";
import { IoRemoveOutline, IoAddOutline, IoCheckmark } from "react-icons/io5";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

import { useStateContext } from "@/context/StateContext";
import getStripe from "@/lib/getStripe";
import toast from "react-hot-toast";
import axios from "axios";
import CryptoJS from "crypto-js";

// Helper to generate booking ID
const generateBookingId = () => {
  const timestamp = Date.now().toString(36); // Convert timestamp to base 36
  const randomNumbers = Math.random().toString(36).substr(2, 6).toUpperCase(); // Generate random part
  return (timestamp + randomNumbers).substr(0, 12).toUpperCase(); // Combine and ensure 12 characters
};

const hashSHA256 = async (message) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert buffer to array of bytes
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // Convert bytes to hex string (lowercase)
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toLowerCase();

  return hashHex;
};

const BookingSummary = ({ theaterDetails, movieDetails }) => {
  const currentSlug = movieDetails.slug.current;

  const {
    setTotalPrice,
    selectedSeats,
    setPhoneNumber,
    movieName,
    theaterName,
    selectedTime,
    selectedDate,
    adultQty,
    childrenQty,
    incAdultQty,
    decAdultQty,
    incChildrenQty,
    decChildrenQty,
    totalPrice,
    theaterId,
    stripeTheaterId,
    phoneNumber,
  } = useStateContext();

  const [bookingId, setBookingId] = useState(generateBookingId());
  const [isChecked, setIsChecked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [toggleOtp, setToggleOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [phoneNumberEncoded, setPhoneNumberEncoded] = useState();

  const [mobileNumberHash, setMobileNumberHash] = useState(
    "f8a88275bb387254e5dbaae52b6cdc6dfe401d2857cc82bbe4a427419cad037b"
  );

  useEffect(() => {
    if (localStorage.getItem("mobileVerification") === "true") {
      localStorage.setItem("mobileVerification", "true");
    } else {
      localStorage.setItem("mobileVerification", "false");
    }
  });

  const toggleDialog = () => {
    setIsDialogOpen(true);
  };


  const handleSendOtp = async () => {
    try {
      const response = await axios.post("/api/send-otp", { phoneNumber });
      if (response.data.success) {
        setOtpSent(true);
        toast.success("OTP sent successfully!", {
          style: {
            borderRadius: "1000px",
            background: "#F4F6F5",
            color: "#000",
          },
        });
        console.log(phoneNumber);
      } else {
        toast.error("Failed to send OTP.", {
          style: {
            borderRadius: "1000px",
            background: "#B03C3F",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      toast.error("Error sending OTP.", {
        style: {
          borderRadius: "1000px",
          background: "#B03C3F",
          color: "#fff",
        },
      });
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post("/api/verify-otp", {
        phoneNumber,
        otp,
      });
      if (response.data.success) {
        setIsOtpVerified(true);
        const hashedPhone = await hashSHA256(phoneNumber);
        setMobileNumberHash(hashedPhone);
        sessionStorage.setItem("phone_number", phoneNumber);


        console.log(phoneNumber);

        localStorage.setItem("mobileVerification", true);
        toast.success("OTP verified!", {
          style: {
            borderRadius: "1000px",
            background: "#F4F6F5",
            color: "#000",
          },
        });
      } else {
        toast.error("Invalid OTP.", {
          style: {
            borderRadius: "1000px",
            background: "#B03C3F",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      toast.error("Error verifying OTP.", {
        style: {
          borderRadius: "1000px",
          background: "#B03C3F",
          color: "#fff",
        },
      });
    }
  };

  const handleCheckout = async () => {
    const stripe = await getStripe();

    const validAdultQty = adultQty || 0;
    const validChildrenQty = childrenQty || 0;

    // Get the generated booking ID
    const uniqueBookingId = generateBookingId();

    // Store stripe theater ID in sessionStorage
    sessionStorage.setItem("theaterStripeId", stripeTheaterId);

    const getPhoneNumber = sessionStorage.getItem('phone_number')
    const secretKey = process.env.NEXT_PUBLIC_MOBILE_ENCRYPTION_KEY;
    const encryptedPhoneNumber = CryptoJS.AES.encrypt(
      phoneNumber,
      secretKey
    ).toString();
    sessionStorage.setItem('phone_hash', encryptedPhoneNumber);

    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [
          { name: "Adult Ticket", quantity: adultQty, price: adultPrice || 0 },
          {
            name: "Child Ticket",
            quantity: childrenQty,
            price: childPrice || 0,
          },
        ],
        theaterStripeId: stripeTheaterId,
        movieName,
        theaterName,
        selectedSeats,
        showDate: selectedDate,
        showTime: selectedTime,
        totalPrice,
        uniqueBookingId,
        mobileNumberHash: encryptedPhoneNumber,
        // mobileNumberHash: getPhoneNumber,
        adultQty,
        childrenQty,
        adultPrice,
        childPrice,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Checkout API Error:", errorData);
      toast.error("Error creating checkout session", {
        style: {
          borderRadius: "1000px",
          background: "#B03C3F",
          color: "#fff",
        },
      });
      return;
    }

    const data = await response.json();
    if (!data.sessionId) {
      toast.error("Invalid checkout session", {
        style: {
          borderRadius: "1000px",
          background: "#B03C3F",
          color: "#fff",
        },
      });
      return;
    }

    toast.loading("Redirecting...");
    stripe.redirectToCheckout({ sessionId: data.sessionId });
  };

  useEffect(() => {
    if (isOtpVerified) {
      handleCheckout();
    }
  }, [isOtpVerified]);

  const theater = theaterDetails.find((t) => t._id === theaterId);
  const adultPrice = theater?.pricing?.adultPrice;
  const childPrice = theater?.pricing?.childPrice;

  useEffect(() => {
    if (adultPrice && childPrice) {
      const total = adultPrice * adultQty + childPrice * childrenQty;
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [adultQty, childrenQty, adultPrice, childPrice, setTotalPrice]);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked); // Update state when checkbox is clicked
  };

  return (
    <div className="w-full h-fit md:h-[500px] mt-10 flex items-center justify-center">
      <div className="w-[1000px] h-fit bg-[#141213] rounded-[30px] shadow-gray-300/10 shadow-2xl p-8 pb-20 flex flex-col md:flex-row items-start justify-center">
        <div className="w-full md:w-[55%] h-full">
          <h3 className="text-white text-xl pb-2 font-medium">
            Selected Tickets
          </h3>
          <p className="text-sm text-gray-400">
            {selectedSeats.length} Tickets
          </p>
          <div className="pt-10 pb-5 border-transparent border-r md:border-white">
            {/* Adult Ticket */}
            <div className="w-full h-[50px] flex flex-row">
              <div className="w-[30%] h-full flex items-center justify-center">
                <p className="text-white">{`Adult(s)`}</p>
              </div>
              <div className="w-[70%] h-full flex items-center">
                <div className="w-[110px] h-[40px] flex flex-row items-center bg-[#1B1B20] border border-[#777779] rounded-xl">
                  <span
                    onClick={decAdultQty}
                    className="w-[20%] h-full flex items-center justify-center cursor-pointer"
                  >
                    <IoRemoveOutline color="white" />
                  </span>
                  <p className="w-[60%] h-full flex items-center justify-center prevent-select cursor-text text-white">
                    {adultQty}
                  </p>
                  <span
                    onClick={incAdultQty}
                    className="w-[20%] h-full flex items-center justify-center cursor-pointer"
                  >
                    <IoAddOutline color="white" />
                  </span>
                </div>
              </div>
            </div>

            {/* Children Ticket */}
            <div className="w-full h-[50px] flex flex-row my-4">
              <div className="w-[30%] h-full flex items-center justify-center">
                <p className="text-white">Children</p>
              </div>
              <div className="w-[70%] h-full flex items-center">
                <div className="w-[110px] h-[40px] flex flex-row items-center bg-[#1B1B20] border border-[#777779] rounded-xl">
                  <span
                    onClick={decChildrenQty}
                    className="w-[20%] h-full flex items-center justify-center cursor-pointer"
                  >
                    <IoRemoveOutline color="white" />
                  </span>
                  <p className="w-[60%] h-full flex items-center justify-center prevent-select cursor-text text-white">
                    {childrenQty}
                  </p>
                  <span
                    onClick={incChildrenQty}
                    className="w-[20%] h-full flex items-center justify-center cursor-pointer"
                  >
                    <IoAddOutline color="white" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Checkbox Section */}
          <div className="w-full h-[100px] flex flex-row border-transparent border-r md:border-white">
            <div className="w-[25px] h-full flex justify-center">
              <div
                className="w-full h-[25px] relative"
                onClick={handleCheckboxChange}
              >
                {isChecked ? (
                  <div>
                    <input
                      type="checkbox"
                      className="appearance-none w-[20px] h-[20px] cursor-pointer bg-white rounded-sm border border-white"
                    />
                    <span className="absolute left-[2px] top-[2px] text-gray-400 cursor-pointer">
                      <IoCheckmark color="#0b090a" />
                    </span>
                  </div>
                ) : (
                  <input
                    type="checkbox"
                    className="appearance-none w-[20px] h-[20px] cursor-pointer bg-[#1B1B20] rounded-sm border border-[#777779]"
                  />
                )}
              </div>
            </div>
            <div className="w-[435px] h-full pl-2">
              <p className="text-[15px] text-gray-200">
                I have verified the cinema name, show date, and time before
                proceeding to payment. Once booked, cinema does not allow us to
                Refund/Modify the booking
              </p>
            </div>
          </div>
        </div>
        {/* Booking Summary Section */}
        <div className="w-full md:w-[45%] h-full mt-10 md:mt-0">
          <hr className="mt-20 border border-white md:hidden mb-10" />
          <h3 className="text-white text-xl pb-2 md:pl-5 font-medium">
            Booking Summary
          </h3>
          <div className="w-full flex justify-center">
            <div className="w-[80%] flex-col">
              <div className="w-full mt-15 flex flex-row">
                <div className="w-1/2">
                  {adultQty > 1 ? (
                    <p className="text-white">{adultQty} Adult Tickets</p>
                  ) : (
                    <p className="text-white">{adultQty} Adult Ticket</p>
                  )}

                  {childrenQty > 1 ? (
                    <p className="pt-5 text-white">
                      {childrenQty} Child Tickets
                    </p>
                  ) : (
                    <p className="pt-5 text-white">
                      {childrenQty} Child Ticket
                    </p>
                  )}
                </div>
                <div className="w-1/2 flex justify-end">
                  <div className="flex flex-col items-start">
                    <p className="text-white">
                      {adultPrice ? adultPrice * adultQty : "Not selected"}
                    </p>
                    <p className="pt-5 text-white">
                      {childPrice ? childPrice * childrenQty : "Not selected"}
                    </p>
                  </div>
                </div>
              </div>
              <hr className="mt-20 border border-gray-400" />
              <div className="w-full my-5 flex flex-row">
                <div className="w-1/2">
                  <h3 className="text-lg text-white">Sub Total</h3>
                </div>
                <div className="w-1/2 flex justify-end">
                  <div className="flex flex-col items-start">
                    <h3 className="text-lg text-white">
                      {totalPrice ? totalPrice : "Not available"}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Button */}
              <Button
                className="w-full h-[35px] bg-[#A4BBEF] hover:bg-[#7585ac] cursor-pointer"
                disabled={!isChecked || (adultQty === 0 && childrenQty === 0)}
                onClick={() => {
                  if (localStorage.getItem("mobileVerification") === "true") {
                    handleCheckout();
                  } else {
                    setIsDialogOpen(true);
                  }
                }}
              >
                <p className="text-[#0b090a] font-semibold">
                  Proceed to Checkout
                </p>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Dialog */}
      {isDialogOpen && (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent className="bg-[#1B1B20] border border-[#777779] rounded-2xl h-fit">
            {toggleOtp ? (
              // OTP Input Section
              <>
                <AlertDialogHeader className="py-5">
                  <h3 className="text-lg text-center text-white py-5">
                    OTP Verification
                  </h3>
                  <AlertDialogDescription className="flex flex-col justify-center items-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                      className="w-full flex justify-center"
                    >
                      <InputOTPGroup>
                        {[...Array(6)].map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="w-12 h-12 text-xl text-white border border-white focus:outline-none focus:ring-2 focus:ring-[#777779] text-center"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                    <div className="text-center text-sm mt-2">
                      <p className="text-[#d3d3d3] pt-5">
                        Enter your one-time password
                      </p>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button
                    onClick={() => setToggleOtp(false)} // Switch back to phone number input
                    className="cursor-pointer bg-[#414141] hover:bg-[#353535]"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      if (otp.length === 6) {
                        // Proceed with OTP verification
                        setIsDialogOpen(false);
                        handleVerifyOtp();
                      } else {
                        toast.error("Please enter a valid OTP.", {
                          style: {
                            borderRadius: "1000px",
                            background: "#B03C3F",
                            color: "#fff",
                          },
                        });
                      }
                    }}
                    className="cursor-pointer bg-[#D3D3D3] text-black hover:bg-[#b1b1b1]"
                  >
                    Verify OTP
                  </Button>
                </AlertDialogFooter>
              </>
            ) : (
              // Phone Number Input Section
              <>
                <AlertDialogHeader className="py-5">
                  <h3 className="text-lg text-center text-white py-5">
                    OTP Verification
                  </h3>
                  <AlertDialogDescription className="flex flex-col justify-center items-center">
                    <InputOTP
                      maxLength={11}
                      onChange={(value) =>
                        setPhoneNumber(`+${value.replace(/\D/g, "")}`)
                      }
                    >
                      <InputOTPGroup className="text-white">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                      </InputOTPGroup>
                      <InputOTPSeparator className="text-white" />
                      <InputOTPGroup className="text-white">
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                        <InputOTPSlot index={6} />
                        <InputOTPSlot index={7} />
                        <InputOTPSlot index={8} />
                        <InputOTPSlot index={9} />
                        <InputOTPSlot index={10} />
                      </InputOTPGroup>
                    </InputOTP>
                    <div className="text-center text-sm mt-2">
                      <p className="text-[#d3d3d3] pt-5">
                        Enter your mobile number
                      </p>
                      <p className="text-[#d3d3d3]">{`+(94) xx xxx xxxx`}</p>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => setIsDialogOpen(false)} // Close popup
                    className="cursor-pointer bg-[#414141] hover:bg-[#353535] text-white border-none hover:text-white"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <Button
                    onClick={() => {
                      if (phoneNumber.length >= 12) {
                        setToggleOtp(true); // Switch to OTP input
                        handleSendOtp();
                      } else if (phoneNumber.length == 0) {
                        toast.error("Enter a valid phone number", {
                          style: {
                            borderRadius: "1000px",
                            background: "#B03C3F",
                            color: "#fff",
                          },
                        });
                      } else {
                        toast.error("Enter a valid phone number", {
                          style: {
                            borderRadius: "1000px",
                            background: "#B03C3F",
                            color: "#fff",
                          },
                        });
                      }
                    }}
                    className="cursor-pointer bg-[#D3D3D3] text-black hover:bg-[#b1b1b1]"
                  >
                    Send OTP
                  </Button>
                </AlertDialogFooter>
              </>
            )}
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
export default BookingSummary;
