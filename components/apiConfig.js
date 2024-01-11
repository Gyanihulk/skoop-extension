const backendUrl="https://skoop.sumits.in"; //https://skoop.sumits.in


const API_ENDPOINTS = {
    skoopCalendarUrl: "https://schedule.sumits.in",
    changePassword: `${backendUrl}/changePassword`, // PATCH
    profileDetails: `${backendUrl}/userDetails`, // GET
    updateUserDetails: `${backendUrl}/updateUserDetails`, // PATCH
    addNewDirectory: `${backendUrl}/addNewDirectory`, // POST
    deleteDirectory: `${backendUrl}/deleteDirectory`, // DELETE
    deleteVideo: `${backendUrl}/deleteVideo/`, // DELETE
    renameVideo: `${backendUrl}/renameVideo`, // PATCH
    renameFolder: `${backendUrl}/renameDirectory`, //PATCH
    cgpt: `${backendUrl}/cgpt?`, // GET
    gifs: `${backendUrl}/gifs?`,  // GET
    sendMail: `${backendUrl}/sendmail`, // POST
    videoDirectories: `${backendUrl}/videoDirectories`, // GET
    linkData: `${backendUrl}/linkdata?`, // GET
    addLinkData: `${backendUrl}/addlinkdata`, // POST
    vidyardUpload: `${backendUrl}/vidyardUpload`, // POST
    signIn: `${backendUrl}/login`, // POST
    tokenStatus: `${backendUrl}/tokenStatus`, // GET
    signUp: `${backendUrl}/signup`, // POST
    moveVideos: `${backendUrl}/moveVideos`, // PATCH
    CrmAddContactInfo: `${backendUrl}/CrmAddContactInfo`, // POST
    CrmPreloadedResponses: `${backendUrl}/skoopCrmPreloadedResponses`, //GET
    skoopCrmGetAllData: `${backendUrl}/skoopCrmGetContactInfo`, //GET
    linkedInAuthCode: `${backendUrl}/auth/linkedin`, //GET
    linkedInLogIn: `${backendUrl}/linkedInLogIn`, //POST
    GoogleAuthCode: `${backendUrl}/auth/google`, //GET
    GoogleLogIn: `${backendUrl}/SignInWithGoogle`, //POST
    toggleFavourite: `${backendUrl}/toggleFavourite`,// PATCH
    getThumbnail: `${backendUrl}/getThumbnail/`, //GET
    getOtpForPasswordReset: `${backendUrl}/getOtpForPasswordReset?`, //GET
    resetPasswordUsingOtp: `${backendUrl}/resetPasswordUsingOtp`, //POST
    skoopCrmAddPreloadedResponses: `${backendUrl}/skoopCrmAddPreloadedResponses`, // POST
};

// with POST or PATCH apis body is sent in JSON 
// Authorization is handled using bearer token
// params must be attached whenever required in case of PATCH and GET requests

/*
PATCH moveVideos
body: JSON.stringify({
    to: *the directory where the videos have to be moved*
    videoIds: *an array of video ids (eg vimeo video id = 866687951) * 
})





*/
export default API_ENDPOINTS