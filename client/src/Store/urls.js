let APIURL = 'https://pokingapp.onrender.com/';

// if (process.env.NODE_ENV === 'development') {
//   APIURL = 'http://localhost:2000/';
// }

console.log({APIURL});

const VerifyEmail = () => APIURL + 'api/v1/users/verify';
const VerifyOTP = () => APIURL + 'api/v1/users/Confirm';
const UpdateMe = () => APIURL + 'api/v1/users/updateMe';
const GetMyData = () => APIURL + 'api/v1/users/me';
const GetMyFriends = () => APIURL + 'api/v1/users/friends';
const GetAUser = (email) => APIURL + `api/v1/users/unique/${email}`;
const GetFriendsRequest = () => APIURL + 'api/v1/users/friends-received';

export {
  VerifyEmail,
  VerifyOTP,
  UpdateMe,
  GetMyData,
  GetMyFriends,
  GetAUser,
  GetFriendsRequest
};