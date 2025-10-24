"use client";

import { Buttons } from "@/src/components/export_components";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/src/redux/hooks";

const DashboardSection = () => {
    const { profile } = useAppSelector((state) => state.user);
    const { recruiterProfile } = useAppSelector((state) => state.recruiter);

    const currentUser = profile || recruiterProfile;
    const userName =
        profile?.bio_data?.user_name || recruiterProfile?.bio_data?.full_name;
    const fullName =
        profile?.profile?.full_name || recruiterProfile?.profile?.full_name;

    const userField =
        profile?.profile?.field ||
        profile?.profile?.industry ||
        "Creative Professional";

    const userLocation =
        profile?.profile?.location?.state ||
        "Location not set";

    const userIntroduction =
        profile?.profile?.bio ||
        "No introduction provided yet. Click 'Edit Profile' to add one!";

    const userImage = profile?.profile?.profile_picture;

    const userLevel = "Creative";

    if (!currentUser) {
        return (
            <section className="flex flex-col gap-2 lg:gap-5 my-10 bodyMargin">
                <div className="max-w-xs lg:max-w-6xl bg-secondary px-4 md:px-5 flex items-center">
                    <h2 className="text-lg md:text-3xl font-bold text-white py-5">
                        Your Portfolio, Your Stage – Take Control Now!
                    </h2>
                </div>
                <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
                    <div className="w-full lg:w-2/3 bg-primary rounded-lg py-6 px-4 flex items-center justify-center text-center">
                        <p className="text-sm md:text-base lg:text-2xl font-bold font-ralway text-white max-w-md">
                            Loading your profile...
                        </p>
                    </div>
                    <div className="w-full lg:w-1/3 mx-2">
                        <div className="flex flex-col gap-3 pb-5 px-4 rounded-lg shadow-lg bg-white animate-pulse">
                            <div className="flex justify-between items-center">
                                <div className="w-[100px] h-[100px] bg-gray-300 rounded-full"></div>
                                <div className="bg-gray-300 h-6 w-20 rounded"></div>
                            </div>
                            <div className="bg-gray-300 h-6 w-3/4 rounded"></div>
                            <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
                            <div className="bg-gray-300 h-20 rounded"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="flex flex-col gap-2 lg:gap-5 my-10 bodyMargin">
            {/* Header */}
            <div className="max-w-xs lg:max-w-6xl bg-secondary px-4 md:px-5 flex items-center">
                <h2 className="text-lg md:text-3xl font-bold text-white py-5">
                    Your Portfolio, Your Stage – Take Control Now!
                </h2>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
                {/* Left Side Text */}
                <div className="w-full lg:w-2/3 bg-primary rounded-lg py-6 px-4 flex items-center justify-center text-center">
                    <p className="text-sm md:text-base lg:text-2xl font-bold font-ralway text-white max-w-md">
                        Access your dashboard to showcase your work, track job applications,
                        and connect with top recruiters. Your creative journey starts here!
                    </p>
                </div>

                {/* Right Side Profile Card */}
                <div className="w-full lg:w-1/3 mx-2">
                    <div className="flex flex-col gap-3 pb-5 px-4 rounded-lg shadow-lg text-secondary font-raleway bg-white">
                        <div className="flex justify-between items-center">
                            <div className="relative h-[100px] w-[100px] rounded-lg overflow-hidden bg-gray-200">
                                <Image
                                    src={userImage || "/assets/creative.svg"}
                                    alt={userName || "User"}
                                    fill
                                    className="object-cover"
                                    sizes="100px"
                                />
                            </div>
                            <div className="bg-secondary/80 text-white py-1 px-4 text-sm font-ramaraja">
                                {userLevel}
                            </div>
                        </div>

                        <h2 className="text-primary font-bold text-base md:text-lg">
                            {fullName} ({userName})
                        </h2>

                        <h2 className="text-primary font-extralight text-sm line-clamp-1">
                            {userField} / {userLocation}
                        </h2>

                        <div className="bg-gray100 h-20 p-2 border border-gray100 text-xs line-clamp-3">
                            {userIntroduction}
                        </div>

                        <div className="flex flex-row justify-between gap-3 px-2 text-white">
                            <Link href="/creative-dashboard/edit-profile">
                                <Buttons
                                    label="Edit Profile"
                                    className="bg-primary! w-full lg:w-fit rounded-lg text-sm font-medium"
                                />
                            </Link>
                            <Link href="/creative-dashboard/edit-portfolio">
                                <Buttons
                                    label="Edit Portfolio"
                                    className="bg-primary! w-full lg:w-fit rounded-lg text-sm font-medium"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Go to Dashboard Button */}
            <div className="flex justify-center lg:justify-end mt-6 px-4">
                <Link href="/creative-dashboard">
                    <Buttons
                        label="Go to Dashboard"
                        className="bg-primary! w-fit rounded-lg font-bold text-lg md:text-xl text-white"
                    />
                </Link>
            </div>
        </section>
    );
};

export default DashboardSection;