let APIURL = 'https://pokingapp.onrender.com/';

// if (process.env.NODE_ENV === 'development') {
//   APIURL = 'http://localhost:2000/';
// }


const VerifyEmail = () => APIURL + 'api/v1/users/verify';
const VerifyOTP = () => APIURL + 'api/v1/users/Confirm';
const UpdateMe = () => APIURL + 'api/v1/users/updateMe';
const LogOut = () => APIURL + 'api/v1/users/logout';
const GetMyData = () => APIURL + 'api/v1/users/me';
const GetMyFriends = () => APIURL + 'api/v1/users/friends';
const GetAUser = (email) => APIURL + `api/v1/users/unique/${email}`;
const GetFriendsRequest = () => APIURL + 'api/v1/users/friends-received';
const AddFriend = (id) => APIURL + `api/v1/users/addFriend/${id}`;
const AcceptFriend = (id) => APIURL + `api/v1/users/acceptFriend/${id}`;
const DeclineFriend = (id) => APIURL + `api/v1/users/acceptFriend/${id}`;
const DeleteFriend = (id) => APIURL + `api/v1/users/deleteFriend/${id}`;

export {
  VerifyEmail,
  VerifyOTP,
  UpdateMe,
  LogOut,
  GetMyData,
  GetMyFriends,
  GetAUser,
  GetFriendsRequest,
  AddFriend,
  AcceptFriend,
  DeclineFriend,
  DeleteFriend
};