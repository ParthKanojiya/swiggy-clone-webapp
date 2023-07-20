import { useDispatch, useSelector } from 'react-redux';
import './Profile.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { login, logout } from '../../redux/slice/authSlice';
import Swal from 'sweetalert2';
import { updateSigninSideVisible } from '../../redux/slice/loginSlice';
import axios from 'axios';
import {
  CURR_USER_API_LINK,
  LOGOUT_API_LINK,
  SEND_VERIFY_ACC_API_LINK,
} from '../../utils/config';

const Profile = () => {
  const authData = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const verifyAccount = async () => {
    try {
      await axios.post(SEND_VERIFY_ACC_API_LINK, {
        token: window.localStorage.getItem('token'),
      });
      Swal.fire('Check email!', `Verification send to email!`, 'success');
    } catch (error) {
      Swal.fire('Failed!', error.message, 'error');
    }
  };

  const logoutFunc = async () => {
    try {
      await axios.get(LOGOUT_API_LINK);
      dispatch(logout());
      dispatch(updateSigninSideVisible(true));
      window.localStorage.removeItem('token');
    } catch (error) {
      console.log(error);
      Swal.fire('Failed!', error.message, 'error');
    }
  };

  const getUserData = async () => {
    const { data } = await axios.post(CURR_USER_API_LINK, {
      token: window.localStorage.getItem('token'),
    });
    dispatch(login(data?.data?.user));
  };

  useEffect(() => {
    if (!authData.isAuth) {
      navigate('/');
      dispatch(updateSigninSideVisible(true));
    }
  }, [authData.isAuth]);
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <div className="profile-wrapper">
      <div className="profile">
        <h2>Profile</h2>
        <div>
          {authData?.user?.photoURL ? (
            <div className="img">
              <img src={authData?.user?.photoURL} alt="" />
            </div>
          ) : (
            <div>
              <div className="dummy-img">
                {authData?.user?.name
                  ?.split(' ')
                  ?.map(el => el?.[0]?.toUpperCase())}
              </div>
            </div>
          )}
          <div>
            <div className="name">{authData?.user?.name}</div>
            <div className="email">
              {authData?.user?.email}{' '}
              {!authData?.user?.isVerified ? (
                <button onClick={verifyAccount} className="verify-btn">
                  Not Verify
                </button>
              ) : (
                <button className="verifed-btn">Verified</button>
              )}
            </div>
            {/* {!authData?.user?.providerId && (
							<div className="change-password">
								Change password?
							</div>
						)} */}
            <button
              className="logout-btn"
              onClick={() => {
                Swal.fire({
                  title: 'Are you sure?',
                  text: 'Dou you want to log out?',
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes, Logout!',
                }).then(result => {
                  if (result.isConfirmed) {
                    logoutFunc();
                  }
                });
              }}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
