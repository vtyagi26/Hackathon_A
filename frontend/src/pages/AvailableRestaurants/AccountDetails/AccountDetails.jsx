import classes from "./AccountDetails.module.css";

import { useEffect, useState } from "react";

import axios from "axios";

import { MdOutlineClose } from "react-icons/md";

const AccountDetails = ({ closeDetails, user, setUser }) => {
    const [localuser, setLocalUser] = useState(user);

    const [wastage, setWastage] = useState(null);

    const [formData, setFormData] = useState({
        numberOfGuests: 0,

        quantityOfFood: 0,

        typeOfFoodBakedGoods: 0,
        typeOfFoodDairyProducts: 0,
        typeOfFoodFruits: 0,
        typeOfFoodMeat: 0,
        typeOfFoodVegetables: 0,

        eventTypeBirthday: 0,
        eventTypeCorporate: 0,
        eventTypeSocialGathering: 0,
        eventTypeWedding: 0,

        storageConditionsRefrigerated: 0,
        storageConditionsRoomTemperature: 0,

        purchaseHistoryOccasional: 0,
        purchaseHistoryRegular: 0,

        seasonalityAllSeasons: 0,
        seasonalitySummer: 0,
        seasonalityWinter: 0,

        preparationMethodBuffet: 0,
        preparationMethodFingerFood: 0,
        preparationMethodSitDownDinner: 0,

        geographicalLocationRural: 0,
        geographicalLocationSubUrban: 0,
        geographicalLocationUrban: 0,

        pricingHigh: 0,
        pricingLow: 0,
        pricingModerate: 0,
    });

    function formHandler(event) {
        event.preventDefault();
        const address = event.target[0].value;
        const guests = event.target[1].value;
        const foodQuantity = event.target[2].value;
        const foodType = event.target[3].value;
        const eventType = event.target[4].value;
        const storageConditions = event.target[5].value;
        const purchaseHistory = event.target[6].value;
        const seasonality = event.target[7].value;
        const preparationMethod = event.target[8].value;
        const geographicalLocation = event.target[9].value;
        const pricing = event.target[10].value;

        const data = {
            address,
            guests,
            foodQuantity,
            foodType,
            eventType,
            storageConditions,
            purchaseHistory,
            seasonality,
            preparationMethod,
            geographicalLocation,
            pricing,
        };

        const formDataCopy = { ...formData };

        formDataCopy.numberOfGuests = guests;
        formDataCopy.quantityOfFood = foodQuantity;
        formDataCopy.typeOfFoodMeat = foodType === "meat" ? 1 : 0;
        formDataCopy.typeOfFoodVegetables = foodType === "vegetable" ? 1 : 0;
        formDataCopy.typeOfFoodDairyProducts = foodType === "dairy" ? 1 : 0;
        formDataCopy.typeOfFoodFruits = foodType === "fruits" ? 1 : 0;
        formDataCopy.typeOfFoodBakedGoods = foodType === "baked" ? 1 : 0;
        formDataCopy.eventTypeBirthday = eventType === "occasional" ? 1 : 0;
        formDataCopy.eventTypeCorporate = eventType === "corporate" ? 1 : 0;
        formDataCopy.eventTypeSocialGathering = eventType === "social" ? 1 : 0;
        formDataCopy.eventTypeWedding = eventType === "wedding" ? 1 : 0;
        formDataCopy.storageConditionsRefrigerated =
            storageConditions === "refrigerated" ? 1 : 0;
        formDataCopy.storageConditionsRoomTemperature =
            storageConditions === "room-temp" ? 1 : 0;
        formDataCopy.purchaseHistoryOccasional =
            purchaseHistory === "occasional" ? 1 : 0;
        formDataCopy.purchaseHistoryRegular =
            purchaseHistory === "regular" ? 1 : 0;
        formDataCopy.seasonalityAllSeasons = seasonality === "all" ? 1 : 0;
        formDataCopy.seasonalitySummer = seasonality === "summer" ? 1 : 0;
        formDataCopy.seasonalityWinter = seasonality === "winter" ? 1 : 0;
        formDataCopy.preparationMethodBuffet =
            preparationMethod === "buffet" ? 1 : 0;
        formDataCopy.preparationMethodFingerFood =
            preparationMethod === "finger" ? 1 : 0;
        formDataCopy.preparationMethodSitDownDinner =
            preparationMethod === "sit-down" ? 1 : 0;
        formDataCopy.geographicalLocationRural =
            geographicalLocation === "rural" ? 1 : 0;
        formDataCopy.geographicalLocationSubUrban =
            geographicalLocation === "sub-urban" ? 1 : 0;
        formDataCopy.geographicalLocationUrban =
            geographicalLocation === "urban" ? 1 : 0;
        formDataCopy.pricingHigh = pricing === "high" ? 1 : 0;
        formDataCopy.pricingLow = pricing === "low" ? 1 : 0;
        formDataCopy.pricingModerate = pricing === "moderate" ? 1 : 0;

        setFormData(formDataCopy);

        // console.log(formDataCopy);

        axios
            .post("http://localhost:8000/predict", { ...formDataCopy })
            .then((response) => {
                setWastage(response.data);
            }).then(() => {
                axios.put("http://localhost:8000/restaurant/update", { 
                    ...user, 
                    predictedWaste: wastage.prediction.toFixed(3) 
                });
                setUser({ ...user, predictedWaste: wastage.prediction.toFixed(3) });
                setLocalUser({ ...user, predictedWaste: wastage.prediction.toFixed(3) });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
 <div className={classes.details}>
            <div className={classes.card}>
                <div className={classes.top}>
                    <div className={classes.heading}>
                        <h1>{user.bankName? user.bankName: user.restaurantName}</h1>
                        <p>{user.area}</p>
                        <div className={classes.listedOn}>
                            <p>Email ID:</p>
                            <p>{user.email}</p>
                        </div>
                        <div className={classes.listedOn}>
                            <p>Current Wastage:</p> 
                            <p>{localuser.predictedWaste} kg</p>
                            {/* {wastage && (
                                              <p>{`Predicted Wastage : ${wastage.prediction.toFixed(2)} kg`}</p>
                                        )} */}
                        </div>
                    </div>
                    <div className={classes.topButtons}>
                        <MdOutlineClose
                            fill="#05A60B"
                            size={30}
                            onClick={closeDetails}
                            className={classes.closeIcon}
                        />
                        {/* <button>ASSIGN VOLUNTEER</button> */}
                    </div>
                </div>
                <div className={classes.bottom}>
                      <div className={classes.predict}>
                                  <form action="" className={classes.form} onSubmit={formHandler}>
                                      <h1>Wastage Prediction Model</h1>
                                      <div className={classes.content}>
                                          <input type="text" placeholder="Address" required defaultValue={user.area} />
                                          <div className={classes.div1}>
                                              <input
                                                  required
                                                  type="text"
                                                  placeholder="Number of Guests (per day)"
                                              />
                                              <input
                                                  required
                                                  type="text"
                                                  placeholder="Quantity of food (per Guest)"
                                              />
                                          </div>
                                          <div className={classes.div2}></div>
                                          <div className={classes.div3}>
                                              <select name="food" id="Food">
                                                  <option value="" disabled selected hidden>
                                                      Food Type
                                                  </option>
                                                  <option value="meat">Meat</option>
                                                  <option value="vegetable">Vegetable</option>
                                                  <option value="dairy">Dairy Products</option>
                                                  <option value="fruits">Fruits</option>
                                                  <option value="baked">Baked Goods</option>
                                              </select>
                                              <select name="Event" id="event">
                                                  <option value="" disabled selected hidden>
                                                      Event Type
                                                  </option>
                                                  <option value="occasional">Birthday</option>
                                                  <option value="corporate">Corporate</option>
                                                  <option value="social">Social Gathering</option>
                                                  <option value="wedding">Wedding</option>
                                              </select>
                                              <select
                                                  required
                                                  name="Storage Conditions"
                                                  id="storageconditions"
                                              >
                                                  <option value="" disabled selected hidden>
                                                      Storage Condition
                                                  </option>
                                                  <option value="refrigerated">Refrigerated</option>
                                                  <option value="room-temp">
                                                      Room - temperature
                                                  </option>
                                              </select>
                                              <select
                                                  required
                                                  name="Purchase History"
                                                  id="purchasehistory"
                                              >
                                                  <option value="" disabled selected hidden>
                                                      Purchase History
                                                  </option>
                                                  <option value="occasional">Occasional</option>
                                                  <option value="regular">Regular</option>
                                              </select>
                                              <select required name="Seasonality" id="seasonality">
                                                  <option value="" disabled selected hidden>
                                                      Seasonality
                                                  </option>
                                                  <option value="all">All Seasons</option>
                                                  <option value="summer">Summer</option>
                                                  <option value="winter">Winter</option>
                                              </select>
                                              <select
                                                  required
                                                  name="Preparation Method"
                                                  id="preparationmethod"
                                              >
                                                  <option value="" disabled selected hidden>
                                                      Even Type
                                                  </option>
                                                  <option value="buffet">Buffet</option>
                                                  <option value="finger">Finger Food</option>
                                                  <option value="sit-down">Sit Down Dinner</option>
                                              </select>
                                              <select
                                                  required
                                                  name="Geographical Location"
                                                  id="geographicallocation"
                                              >
                                                  <option value="" disabled selected hidden>
                                                      Geographical Location
                                                  </option>
                                                  <option value={"rural"}>Rural</option>
                                                  <option value={"sub-urban"}>Sub - urban</option>
                                                  <option value={"urban"}>Urban</option>
                                              </select>
                                              <select required name="Pricing" id="pricing">
                                                  <option value="" disabled selected hidden>
                                                      Pricing
                                                  </option>
                                                  <option value={"high"}>High</option>
                                                  <option value={"low"}>Low</option>
                                                  <option value={"moderate"}>Moderate</option>
                                              </select>
                                          </div>
                                          <button>Submit</button>
                                          {wastage && (
                                              <p
                                                  className={classes.wastage}
                                              >{`Predicted Wastage : ${wastage.prediction.toFixed(
                                                  5
                                              )} kg`}</p>
                                          )}
                                      </div>
                                  </form>
                              </div>  
                </div>
                </div>
            </div>
    );
}

export default AccountDetails;