import classes from "./DonationRequests.module.css";

import { useEffect, useState } from "react";
import TopNavbar from "../TopNavbar/TopNavbar";
import SideNavbar from "../SideNavbar/SideNavbar";
import axios from "axios";
import { useParams } from "react-router-dom";

import { FaCirclePlus } from "react-icons/fa6";
import Time from "../../Time";

import { MdOutlineClose } from "react-icons/md";
import AccountDetails from "../AvailableRestaurants/AccountDetails/AccountDetails.jsx";

const DonationRequests = () => {
  const [displayIndex, setDisplayIndex] = useState(null);
  const [newDonation, setNewDonation] = useState(false);
  const [restaurantData, setRestaurantData] = useState([]);
  const [foodBankData, setFoodBankData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currUser, setCurrUser] = useState(null);
  const [donationHistory, setDonationHistory] = useState([]);
  const [isAccountOpen, setIsAccountOpen] = useState(false);


  const params = useParams();

  useEffect(() => {
    // Fetch restaurant and food bank data, find user, and fetch donation history
    const fetchData = async () => {
      try {
        const restaurantRes = await axios.get(
          "http://localhost:8000/restaurant/get"
        );
        setRestaurantData(restaurantRes.data);

        const foodBankRes = await axios.get(
          "http://localhost:8000/foodBank/get"
        );
        setFoodBankData(foodBankRes.data);

        // Find the current user based on profileId
        const user = restaurantRes.data.find(
          (user) => user.id == params.profileId
        );
        if (user) {
          setCurrUser(user);
        }

        // Fetch donation history
        if (user) {
          const donationRes = await axios.get(
            "http://localhost:8000/foodItem/get"
          );
          const history = donationRes.data.filter(
            (foodItem) => foodItem.restaurantId === user.id
          );
          setDonationHistory(history);
        }

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [params.profileId]);

  const displayInformation = (index) => {
    setDisplayIndex(displayIndex === index ? null : index);
  };

  const makeNewDonation = () => {
    setNewDonation(!newDonation);
  };

  const handleFoodCreate = async (event) => {
    event.preventDefault();

    const formattedDate = new Date(event.target.expiryDate.value)
      .toISOString()
      .split("T")[0];

    const data = {
      itemName: event.target.itemName.value,
      quantity: parseInt(event.target.quantity.value),
      expiryDate: formattedDate,
      price: parseFloat(event.target.price.value),
      restaurantId: currUser?.id,
      restaurant: currUser?.restaurantName,
    };

    currUser.currentWaste = currUser.currentWaste + data.quantity;
    await axios.put("http://localhost:8000/restaurant/update", currUser);

    try {
      const response = await axios.post(
        "http://localhost:8000/foodItem/create",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      (currUser.foodItems === "place")? currUser.foodItems = data.itemName : currUser.foodItems = currUser.foodItems + ", " + data.itemName;
      await axios.put("http://localhost:8000/restaurant/update", currUser);

      // After creating a donation, refresh donation history
      const donationRes = await axios.get("http://localhost:8000/foodItem/get");
      const history = donationRes.data.filter(
        (foodItem) => foodItem.restaurantId === currUser.id
      );
      setDonationHistory(history); // Update donation history state
      setNewDonation(false); // Close the donation form
    } catch (error) {
      console.error(
        "Unable to create listing:",
        error.response?.data || error.message
      );
      setError(error); // Handle error
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const handleFoodDelete = async (event, id) => {
    event.preventDefault();

    try {
      const res = await axios.delete(
        `http://localhost:8000/foodItem/delete/${id}`
      );

      currUser.currentWaste = currUser.currentWaste - donationHistory.find(
        (foodItem) => foodItem.id === id
      ).quantity;
      await axios.put("http://localhost:8000/restaurant/update", currUser);

      const donationRes = await axios.get("http://localhost:8000/foodItem/get");
      
      const history = donationRes.data.filter(
        (foodItem) => foodItem.restaurantId === currUser.id
      );
      setDonationHistory(history);
    } catch (error) {
      console.log("Error deleting item" + error); 
    }
  };

  const closeAccount = () => {
    setIsAccountOpen(false);
  };

  const openAccount = () => {
    setIsAccountOpen(true);
  };

  return (
    <div className={classes.availableRestaurants}>
      <div className={classes.topFiller}></div>
      <div className={classes.sideFiller}></div>

      {newDonation && (
        <div className={classes.newDonation2}>
          <div className={classes.newDonationDiv}>
            <div className={classes.closeIcon}>
              <MdOutlineClose
                fill="#05A60B"
                onClick={makeNewDonation}
                className={classes.closeIconImg}
                size={30}
              />
            </div>
            <form onSubmit={handleFoodCreate}>
              <input
                type="text"
                placeholder="Item Name"
                name="itemName"
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                name="quantity"
                min="1"
                required
              />
              <input
                type="date"
                placeholder="Expiry Date"
                name="expiryDate"
                required
              />
              <input
                type="number"
                placeholder="Price"
                name="price"
                step="0.01"
                min="0"
                required
              />
              <div className={classes.wastage}>
                <p>{`Your daily wastage = ${(currUser.predictedWaste).toFixed(2)}kg`}</p>
                <p>{`Today's Donations = ${currUser.currentWaste}kg`}</p>
                <p>{`Remaining = ${
                  (currUser.predictedWaste - currUser.currentWaste).toFixed(2)
                }kg`}</p>
              </div>
              <button type="submit">SUBMIT LIST</button>
            </form>
          </div>
        </div>
      )}

      {!newDonation && (
        <div className={classes.main}>
          <TopNavbar
            showNavbar={true}
            userName={`Username: ${currUser?.restaurantName}`}
            location={`Location: ${currUser?.area}`}
          />
          <SideNavbar showNavbar={true} setIsAccountOpen={setIsAccountOpen} />
          <div className={classes.cards}>
            <div className={classes.card}>
              <div className={classes.newDonation} onClick={makeNewDonation}>
                <FaCirclePlus size={30} fill="#099A4F" />
                <p>Make a new donation</p>
              </div>
            </div>

            <div className={classes.card}>
              <div className={classes.cardTop}>
                <h1>FOODBANK REQUESTS</h1>
                <p>Requests near you (within 7 km)</p>
              </div>
              <div className={classes.cardBottom}>
                <Time className={classes.time} />
                {foodBankData.map((request, index) => (
                  <div key={index}>
                    <div className={classes.container}>
                      <div className={classes.containerDiv}>
                        <h1>{request.bankName}</h1>
                        <p>{`${request.area} (Quantity: ${Math.floor(
                          Math.random() * 150 + 1
                        )})`}</p>
                      </div>
                      <button>ASSIGN TO ME</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={classes.card}>
              <div className={classes.cardTop}>
                <h1>DONATION HISTORY</h1>
                <p>
                  <Time />
                </p>
              </div>
              <div className={classes.cardBottom}>
                {donationHistory && donationHistory.length > 0 ? (
                  donationHistory.map((request, index) => (
                    <div key={index}>
                      <div
                        className={classes.container}
                        onClick={() => displayInformation(index)}
                      >
                        <div className={classes.containerDiv}>
                          <h1>{`Donation: #${request.id}`}</h1>
                          <p>{`Name: ${request.itemName}`}</p>
                          <p>{`Quantity: ${request.quantity} kg`}</p>
                          <p>{`Price: ₹${request.price}`}</p>
                          <p>{`Expiry Date: ${request.expiryDate}`}</p>
                        </div>
                        <button
                          className={classes.button}
                          onClick={(event) =>
                            handleFoodDelete(event, request.id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <h1>No donation history available.</h1>
                )}
              </div>
            </div>
          </div>

          {isAccountOpen && (
          <div className={classes.modal}>
            <div className={classes.modalContent}>
              <AccountDetails closeDetails={closeAccount} user={currUser} setUser={setCurrUser}/>
              <button onClick={closeAccount} className={classes.closeButton}>
                Close Modal
              </button>
            </div>

          
          </div>
        )}
        </div>
      )}
    </div>
  );
};

export default DonationRequests;
