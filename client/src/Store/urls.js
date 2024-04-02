const APIURL = 'https://pokingapp.onrender.com/';

const VerifyEmail = () => APIURL + 'api/v1/users/verify';
const VerifyOTP = () => APIURL + 'api/v1/users/Confirm';
const UpdateMe = () => APIURL + 'api/v1/users/updateMe';
const GetMyData = () => APIURL + 'api/v1/users/me';
const GetMyFriends = () => APIURL + 'api/v1/users/friends';
const GetAUser = () => APIURL + 'api/v1/users/unique';

export {
  VerifyEmail,
  VerifyOTP,
  UpdateMe,
  GetMyData,
  GetMyFriends,
  GetAUser
};