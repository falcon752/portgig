"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchCreatorsApi } from "@/src/lib/requests/creators";
import { trackProfileViewApi } from "@/src/lib/requests/creative-profile";
import { LoadingSpinner } from "@/src/utils/util_component";
import Buttons from "@/src/components/Buttons";
import { IoMdCheckmark } from "react-icons/io";
import { HiXMark } from "react-icons/hi2";
import { createOrGetChatRoom } from "@/src/lib/firebase/chat";
import { useAppSelector } from "@/src/redux/hooks";
import { useState, useEffect } from "react";
import { getUserId } from "@/src/utils/chats";

type SkillLevel =
    | "Beginner"
    | "Intermediate"
    | "Mid-level"
    | "Professional"
    | "Expert";

const mapExperienceToSkillLevel = (
    yearsOfExperience: string | number | null | undefined
): SkillLevel => {
    if (yearsOfExperience == null) return "Beginner";
    let years = 0;
    try {
        if (typeof yearsOfExperience === "string") {
            if (yearsOfExperience.trim() === "") return "Beginner";
            const match = yearsOfExperience.match(/(\d+)/);
            years = match ? Number.parseInt(match[1], 10) : 0;
        } else if (typeof yearsOfExperience === "number") {
            years = yearsOfExperience;
        }
        years = isNaN(years) ? 0 : Math.max(0, years);
    } catch {
        return "Beginner";
    }
    if (years <= 1) return "Beginner";
    if (years === 2) return "Intermediate";
    if (years === 3) return "Mid-level";
    if (years >= 4 && years <= 6) return "Professional";
    return "Expert";
};

const useCreativeProfile = (creative: any) => {
    if (!creative) {
        return {
            fullName: "Unknown",
            industry: "N/A",
            location: "N/A",
            bio: "No bio available",
            profilePicture: "/assets/creative.svg",
            yearsOfExperience: 0,
            skillLevel: "Beginner" as SkillLevel,
            hasPortfolio: false,
            templateType: null,
        };
    }

    // Extract location properly
    const locationState = creative?.profile?.location?.state;
    const locationCity = creative?.profile?.location?.city;
    let location = "N/A";
    if (locationState && locationCity) {
        location = `${locationCity}, ${locationState}`;
    } else if (locationState) {
        location = `${locationState} State`;
    } else if (locationCity) {
        location = locationCity;
    }

    return {
        fullName: creative?.bio_data?.full_name ?? creative?.bio_data?.user_name ?? "Unknown",
        industry: creative?.profile?.industry ?? creative?.industry ?? "N/A",
        location,
        bio: creative?.bio_data?.bio ?? creative?.profile?.bio ?? "No bio available",
        profilePicture: creative?.profile?.profile_picture ?? "/assets/creative.svg",
        yearsOfExperience: creative?.profile?.years_of_experience ?? 0,
        skillLevel: mapExperienceToSkillLevel(creative?.profile?.years_of_experience),
        hasPortfolio: Boolean(
            creative?.portfolio?.template_type ||
            creative?.template_type ||
            creative?.portfolio_template
        ),
        templateType:
            creative?.portfolio?.template_type ??
            creative?.template_type ??
            creative?.portfolio_template ??
            null,
    };
};

const ProfileCard = () => {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const creativeId = params?.id as string;
    const [chatLoading, setChatLoading] = useState(false);
    const [viewTracked, setViewTracked] = useState(false);
    const { profile } = useAppSelector((state) => state.user);
    const { recruiterProfile } = useAppSelector((state) => state.recruiter);
    const currentUser = profile || recruiterProfile;
    const currentUserId = currentUser ? getUserId(currentUser) : null;
    const currentUserType = profile ? "creator" : "recruiter";

    const {
        data: creatorsResponse,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["creators"],
        queryFn: fetchCreatorsApi,
    });

    const creators = creatorsResponse?.data?.page_data || [];
    const creative = creativeId
        ? creators.find((c: any) => c?._id === creativeId)
        : null;
    const creativeProfile = useCreativeProfile(creative);

    useEffect(() => {
        const trackView = async () => {
            console.log('🔍 Profile View Check:', {
                viewTracked,
                currentUserId,
                creativeId,
                hasCreative: !!creative,
                isOwnProfile: currentUserId === creativeId,
                currentUserType
            });
            
            if (
                viewTracked ||
                !currentUserId ||
                !creative ||
                currentUserId === creativeId
            ) {
                console.log('⚠️ Skipping profile view tracking:', {
                    reason: viewTracked ? 'Already tracked' 
                        : !currentUserId ? 'No viewer ID' 
                        : !creative ? 'No creative data' 
                        : 'Viewing own profile'
                });
                return;
            }
            
            try {
                console.log('📊 Attempting to track profile view...');
                await trackProfileViewApi({
                    userId: creativeId,
                    viewerId: currentUserId,
                    recipientRole: currentUserType === "recruiter" ? "recruiter" : "creator",
                });
                setViewTracked(true);
                console.log('✅ Profile view tracked and state updated');
            } catch (error) {
                console.error('❌ Failed to track profile view:', error);
            }
        };
        if (creative && currentUserId && !viewTracked) {
            trackView();
        }
    }, [creative, currentUserId, creativeId, viewTracked, currentUserType]);

    const handleGoBack = () => router.push("/creatives-hub");

    const handleStartChat = async () => {
        if (!creative || !currentUser || !currentUserId) return;
        const creativeUserId = getUserId(creative);
        if (!creativeUserId || chatLoading) return;
        setChatLoading(true);
        try {
            const creativeUserType = "creative";
            const chatId = await createOrGetChatRoom(
                currentUser,
                creative,
                currentUserType === "creator" ? "creative" : "recruiter",
                creativeUserType
            );
            if (chatId) router.push(`/chats/${chatId}`);
        } catch (err) {
            console.error("Failed to start chat:", err);
            alert("Failed to start chat. Please try again.");
        } finally {
            setChatLoading(false);
        }
    };

    const handleViewPortfolio = () => {
        if (!creativeProfile.hasPortfolio || !creativeProfile.templateType) {
            alert("Portfolio not available for this creative.");
            return;
        }
        
        // Map template types to their numeric IDs
        const templateIdMap: Record<string, number> = {
            "WRITER": 4,
            "VIDEOGRAPHER": 3,
            "DEVELOPER": 2,
            "PHOTOGRAPHER": 1,
            "SOCIAL_MEDIA_MANAGER": 5,
            "DESIGNER": 6,
        };
        
        const templateId = templateIdMap[creativeProfile.templateType];
        
        if (!templateId) {
            alert("Portfolio template not supported.");
            return;
        }
        
        let portfolioPath = "";
        switch (creativeProfile.templateType) {
            case "WRITER":
                portfolioPath = `/writer-portfolio/${templateId}?creatorId=${creativeId}`;
                break;
            case "VIDEOGRAPHER":
                portfolioPath = `/videographer-portfolio/${templateId}?creatorId=${creativeId}`;
                break;
            case "DEVELOPER":
                portfolioPath = `/developer-portfolio/${templateId}?creatorId=${creativeId}`;
                break;
            case "PHOTOGRAPHER":
                portfolioPath = `/photographer-portfolio/${templateId}?creatorId=${creativeId}`;
                break;
            case "SOCIAL_MEDIA_MANAGER":
                portfolioPath = `/social-media-portfolio/${templateId}?creatorId=${creativeId}`;
                break;
            case "DESIGNER":
                portfolioPath = `/designer-portfolio/${templateId}?creatorId=${creativeId}`;
                break;
            default:
                alert("Portfolio template not supported.");
                return;
        }
        router.push(portfolioPath);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner className="border-primary w-12 h-12 sm:w-16 sm:h-16" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="text-center text-secondary max-w-md w-full bg-gray-100 p-6 sm:p-8 rounded-lg shadow-md">
                    <p className="text-red-500 mb-4 text-sm sm:text-base">
                        {error?.message || "An error occurred while fetching creative data."}
                    </p>
                    <button
                        onClick={handleGoBack}
                        className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/80 transition-colors text-sm sm:text-base"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!creative || !creativeId) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="text-center text-secondary max-w-md w-full bg-gray-100 p-6 sm:p-8 rounded-lg shadow-md">
                    <p className="text-gray-500 mb-4 text-sm sm:text-base">
                        {creative ? "Invalid creative ID." : "Creative not found."}
                    </p>
                    <button
                        onClick={handleGoBack}
                        className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/80 transition-colors text-sm sm:text-base"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen py-10 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 text-primary font-raleway">
            <div className="max-w-5xl mx-auto">
                {/* Main Profile Card */}
                <div className="relative w-full flex flex-col gap-6 sm:gap-8 md:gap-10 shadow-lg rounded-lg px-4 sm:px-8 md:px-10 lg:px-12 py-8 sm:py-10 md:py-12 bg-primary md:bg-primary lg:bg-white text-white md:text-white lg:text-primary transition-all duration-300">

                    {/* Skill Level Badge */}
                    <div className="absolute -top-4 right-4 sm:-top-5 sm:right-6 lg:-top-8 lg:right-8 bg-[#5B84C4] text-white px-4 sm:px-6 py-1 sm:py-2 text-xs sm:text-sm md:text-base lg:text-2xl font-ramaraja shadow-md rounded">
                        {creativeProfile.skillLevel}
                    </div>

                    {/* Profile Info Section */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 md:gap-8 lg:gap-10 w-full mt-6 sm:mt-4">

                        {/* Profile Picture */}
                        <div className="flex-shrink-0">
                            <Image
                                src={creativeProfile.profilePicture}
                                alt={`${creativeProfile.fullName} profile`}
                                width={144}
                                height={144}
                                className="h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-full object-cover border-4 border-white lg:border-gray-200 shadow-md"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/assets/creative.svg";
                                }}
                            />
                        </div>

                        {/* Profile Details */}
                        <div className="flex-1 text-center sm:text-left w-full">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 break-words">
                                {creativeProfile.fullName}
                            </h2>
                            <p className="text-sm sm:text-base md:text-lg lg:text-2xl mb-2 sm:mb-3">
                                {creativeProfile.industry} {creativeProfile.location !== "N/A" && `/ ${creativeProfile.location}`}
                            </p>
                            <p className="text-xs sm:text-sm md:text-base lg:text-xl leading-relaxed text-white lg:text-primary mt-4 sm:mt-6">
                                {creativeProfile.bio}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mt-4">
                        <Buttons
                            label={chatLoading ? "Starting Chat..." : "Let's Chat"}
                            className="w-full sm:flex-1 sm:max-w-[240px] bg-white! text-primary! lg:bg-primary! lg:text-white! rounded! px-4 sm:px-6! py-3! text-sm! sm:text-base! lg:text-xl! whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                            onClick={handleStartChat}
                            disabled={chatLoading || !currentUser}
                        />
                        <Buttons
                            label="View My Portfolio"
                            className="w-full sm:flex-1 sm:max-w-[240px] bg-white! text-primary! lg:bg-primary! lg:text-white! rounded! px-4 sm:px-6! py-3! text-sm! sm:text-base! lg:text-xl! whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                            onClick={handleViewPortfolio}
                            disabled={!creativeProfile.hasPortfolio}
                        />
                    </div>
                </div>

                {/* Accept/Reject Buttons */}
                <div className="flex justify-between items-center gap-4 mt-8 sm:mt-10 md:mt-12">
                    <button
                        onClick={handleGoBack}
                        className="bg-primary text-white px-6 sm:px-10 md:px-12 py-3 sm:py-4 rounded-full flex items-center justify-center min-w-[120px] sm:min-w-[160px] cursor-pointer hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                        aria-label="Reject and go back"
                    >
                        <HiXMark className="text-2xl sm:text-3xl md:text-4xl font-bold" />
                    </button>
                    <button
                        onClick={handleGoBack}
                        className="bg-primary text-white px-6 sm:px-10 md:px-12 py-3 sm:py-4 rounded-full flex items-center justify-center min-w-[120px] sm:min-w-[160px] cursor-pointer hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                        aria-label="Accept and go back"
                    >
                        <IoMdCheckmark className="text-2xl sm:text-3xl md:text-4xl" />
                    </button>
                </div>
            </div>
        </main>
    );
};

export default ProfileCard;