export const getUserId = (user: any): string => {
  if (!user) return '';
  return user._id || user.id || '';
};

export const getUserType = (user: any, profile?: any, recruiterProfile?: any): 'recruiter' | 'creative' => {
  if (profile || recruiterProfile) {
    return profile ? 'creative' : 'recruiter';
  }
  
  if (!user) return 'creative';
  
  if (user.userType === 'recruiter' || user.userType === 'creative') {
    return user.userType;
  }

  return 'creative';
};

export const getUserName = (user: any): string => {
  if (!user) return 'Unknown User';
  
  return user.bio_data?.full_name ||           
         user.name ||                          
         user.fullName ||                      
         user.full_name ||                
         user.firstName + ' ' + user.lastName ||
         user.username ||                    
         user.email ||                         
         'Unknown User';                 
};

export const getUserProfilePicture = (user: any): string | null => {
  if (!user) return null;
  console.log('user', user)
  return user.profile?.profile_picture || 
         user.profile_picture || 
         user.bio_data?.profile_picture || 
         null;

};

export const getCurrentUserInfo = (profile: any, recruiterProfile: any) => {
  const currentUser = profile || recruiterProfile;
  const userType = profile ? 'creative' : 'recruiter';
  const userId = getUserId(currentUser);
  const userName = getUserName(currentUser);
  
  return {
    currentUser,
    userType,
    userId,
    userName
  };
};