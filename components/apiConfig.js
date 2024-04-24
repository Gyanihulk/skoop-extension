const backendUrl = "https://api.skoopapp.com"; //https://skoop.sumits.in http://localhost:4000 //https://api.skoopapp.com

const API_ENDPOINTS = {
  backendUrl,
  skoopCalendarUrl: "https://crm.skoopapp.com", //https://skoopcrm.sumits.in
  changePassword: `${backendUrl}/changePassword`, // PATCH
  profileDetails: `${backendUrl}/userDetails`, // GET
  updateUserDetails: `${backendUrl}/updateUserDetails`, // PATCH
  addNewDirectory: `${backendUrl}/addNewDirectory`, // POST
  deleteDirectory: `${backendUrl}/deleteDirectory`, // DELETE
  deleteVideo: `${backendUrl}/deleteVideo/`, // DELETE
  renameVideo: `${backendUrl}/renameVideo`, // PATCH
  renameFolder: `${backendUrl}/renameDirectory`, //PATCH
  cgpt: `${backendUrl}/cgpt?`, // GET
  gifs: `${backendUrl}/gifs?`, // GET
  sendMail: `${backendUrl}/sendmail`, // POST
  videoDirectories: `${backendUrl}/videoDirectories`, // GET
  linkData: `${backendUrl}/linkdata?`, // GET
  addLinkData: `${backendUrl}/addlinkdata`, // POST
  vidyardUpload: `${backendUrl}/vidyardUpload`, // POST
  vidyardUploadAudio: `${backendUrl}/vidyardUploadAudio`, // POST
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
  toggleFavourite: `${backendUrl}/toggleFavourite`, // PATCH
  getThumbnail: `${backendUrl}/getThumbnail/`, //GET
  getOtpForPasswordReset: `${backendUrl}/getOtpForPasswordReset?`, //GET
  resetPasswordUsingOtp: `${backendUrl}/resetPasswordUsingOtp`, //POST
  skoopCrmAddPreloadedResponses: `${backendUrl}/skoopCrmAddPreloadedResponses`, // POST
  chatgptprompt: `${backendUrl}/chatgptprompt`, // GET
  replaceCrmPreloaded: `${backendUrl}/replaceCrmPreloaded`, //PUT
  deleteCrmPreloaded: `${backendUrl}/deleteCrmPreloaded`, //DELETE
  updateProfileImage: `${backendUrl}/updateProfileImage`, // POST
  userPreferences: `${backendUrl}/user-appointment-preferences`, // POST
  syncCalendar: `${backendUrl}/sync-calendar`, // POST
  getCalendarUrl: `${backendUrl}/getcalendarurl`, //GET
  updateCalendarUrl: `${backendUrl}/update-calendar-url`, // POST,
  updateThumbnailImage: `${backendUrl}/updateThumbnail`, // POST,
  updateVideoInfo: `${backendUrl}/updatevideoinfobyvideoid/`, // PUT,
  resetBookingUrl: `${backendUrl}/resetBookingUrl`, // GET
  getUserPreferences: `${backendUrl}/user-appointment-preferences`, // GET
  createSubscription: `${backendUrl}/subscription`, // POST
  createUserDevice: `${backendUrl}/userdevices`, //POST
  getUserDevices: `${backendUrl}/userdevices`, //GET
  validateCoupon: `${backendUrl}/validate-coupon`, //GET
  getVideoInfo: `${backendUrl}/videoinfobyvideoid`, //GET
  mySubscriptions: `${backendUrl}/subscription`, // GET
  logout: `${backendUrl}/logout`, // delete
  deleteAllJwtSessions:`${backendUrl}/jwtsession/all`, // delete
  linkedInLogInDeleteSession: `${backendUrl}/linkedInDeleteSession`, //POST
  GoogleLogInDeleteSession: `${backendUrl}/SignInWithGoogleDeleteSession`, //POST
  createContactUs: `${backendUrl}/contact-us`, //POST
  createReportBugs: `${backendUrl}/report-bug`, //POST
  getVideoDownloadLink:`${backendUrl}/getdownloadLink`
};

// with POST or PATCH apis body is sent in JSON
// Authorization is handled using bearer token
// params must be attached whenever required in case of PATCH and GET requests


export default API_ENDPOINTS;
