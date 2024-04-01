const APIURL = 'https://pokingapp.onrender.com/';

const VerifyEmail = () => { APIURL + 'api/v1/users/verify' };
const VerifyOTP = () => { APIURL + 'api/v1/users/Confirm' };

export {
  VerifyEmail,
  VerifyOTP
};