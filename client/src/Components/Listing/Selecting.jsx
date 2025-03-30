import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { ListingContext } from "../../Context/listing-context.jsx";
import { useChat } from "../../Context/chat-context";
import ChatWindow from "../Chat/ChatWindow";
import "../Cards/Cards.css";
import "./Selecting.css";
import Modal from "../../Components/Modal/Modal";
import Modal2 from "../Modal/Modal2";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";

import Hotjar from '@hotjar/browser';
const siteId = 3765543;
const hotjarVersion = 6;
Hotjar.init(siteId, hotjarVersion);
const selectionsPage = '/selections';
Hotjar.stateChange(selectionsPage);

export const Listing = () => {
  const {
    selectRoommateEmail,
    selectRoommatePhone,
    showModal,
    showModal2,
    selectRoommateDetail,
    selectRoomDetail,
    selectRoomEmail,
    selectRoomPhone,
  } = useContext(ListingContext);

  const { activeChats, startChat, closeChat } = useChat();
  const profileData = JSON.parse(secureLocalStorage.getItem("profile"));
  const navigate = useNavigate();
  const [following, setFollowing] = useState(new Set());
  const [likeRoom, setLikeRoom] = useState(new Set());
  const [roommatePosts, setRoommatePosts] = useState([]);
  const [roomPosts, setRoomPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  Hotjar.identify(profileData?.user?.username, {
    first_name: profileData?.user?.firstname,
    last_name: profileData?.user?.lastname,
    gender: profileData?.gender
  });

  useEffect(() => {
    if (!profileData) {
      console.error('Error accessing user profileData');
      toast.error('Error L4597E. Please Sign In again.')
      navigate("/");
    }
  }, [profileData, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/user/${profileData?.user?._id}`
        );
        setFollowing(new Set(response.data.following));
        setLikeRoom(new Set(response.data.likeRoom));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [profileData?.user?._id]);

  useEffect(() => {
    const fetchRoommatePosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/roommate/all`
        );
        setRoommatePosts(response.data);
      } catch (error) {
        console.error("Error fetching roommate posts:", error);
      }
    };

    fetchRoommatePosts();
  }, []);

  useEffect(() => {
    const fetchRoomPosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/room/all`
        );
        setRoomPosts(response.data);
      } catch (error) {
        console.error("Error fetching room posts:", error);
      }
    };

    fetchRoomPosts();
  }, []);

  const handleStartChat = async (roommate) => {
    const chat = await startChat({
      _id: roommate._id,
      firstname: roommate.firstname,
      lastname: roommate.lastname,
    });
    
    if (chat) {
      toast.success("Chat started successfully!");
    }
  };

  const matchingRoommateData = roommatePosts.filter((post) =>
    following.has(post?._id)
  );

  const matchingRoomData = roomPosts
    .filter((post) => post?.hasOwnProperty('_id') && likeRoom.has(post?._id));

  return (
    <div className="listing">
      <div className="listing-buttons">
        <button className="activelisting">
          <p className="listing-text">Your Selections</p>
        </button>
      </div>
      <div className="profiletab-hr">
        <hr />
      </div>
      <div className="tab-content">
        {isLoading ? (
          <div className="loading-indicator-container">
            <CircularProgress disableShrink color="primary" size={40} />
          </div>
        ) : (
          <div>
            {showModal && <Modal />}
            <div className="cards">
              {matchingRoommateData.map((item) => (
                <div className="each-card" key={item?.id}>
                  <span className="cards">
                    <div className="main-card">
                      <div className="card-details">
                        <div
                          className="card-img"
                          style={{
                            backgroundImage: `url('https://static01.nyt.com/images/2020/04/19/magazine/19Ethicist/19Ethicist-jumbo.jpg')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        ></div>
                        <div className="card-info">
                          <div className="card-informatios">
                            <div className="card-name">Roommate Posting</div>
                            <div className="card-actions">
                              <button
                                className="chat-button"
                                onClick={() => handleStartChat(item)}
                              >
                                Chat
                              </button>
                            </div>
                          </div>
                          <div className="card-preference">
                            <div className="card-rank">
                              <div className="card-preference-title">Rank</div>
                              <div className="card-preference-content">
                                {item?.rank}
                              </div>
                            </div>
                            <div className="card-bed">
                              <div className="card-preference-title">
                                Preferred Bed Type
                              </div>
                              <div className="card-preference-content">
                                {item?.preferredBed}
                              </div>
                            </div>
                            <div className="card-bed">
                              <div className="card-preference-title">Vacancy</div>
                              <div className="card-preference-content">
                                {item?.remaining}
                              </div>
                            </div>
                          </div>
                          <div className="card-downers">
                            <div className="card-year">
                              <div className="card-preference-title">Year</div>
                              <div className="card-preference-Year">
                                {item?.year}
                              </div>
                            </div>
                            <div className="card-gender">
                              <div className="card-preference-title">Gender</div>
                              <div className="card-preference-Gender">
                                {item?.gender}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-hr">
                        <hr />
                      </div>
                      <div className="card-habits-section">
                        <div className="card-habit">For Description - Click on the button</div>
                        <div
                          className="card-habit-details"
                          onClick={() => {
                            selectRoommateDetail(item?.desc);
                            selectRoommatePhone(item?.phone);
                            selectRoommateEmail(item?.username);
                          }}
                        >
                          <div>
                            <img
                              src="./image/desc.png"
                              alt=""
                              style={{ height: "18px", width: "18px" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {activeChats.map((chat) => (
        <ChatWindow
          key={chat.id}
          chatId={chat.id}
          otherUser={chat.otherUser}
          onClose={() => closeChat(chat.id)}
        />
      ))}
    </div>
  );
};
