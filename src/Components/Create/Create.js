import React, { Fragment, useState, useContext } from "react";
import "./Create.css";
import Header from "../Header/Header";
import { Firebase } from "../../firebase/config";
import { AuthContext } from "../../contextStore/AuthContext";
import { useNavigate } from "react-router-dom";
import GoLoading from "../Loading/GoLoading";
const Create = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  let [name, setName] = useState("");
  let [category, setCategory] = useState("");
  let [price, setPrice] = useState("");
  let [description, setDescription] = useState("");
  let [image, setImage] = useState();
  let [location, setLocation] = useState("");
  let [loading, setLoading] = useState(false);
  const handleSubmit = () => {
    setLoading(true);
    let date = new Date().toDateString();
    Firebase.storage()
      .ref(`/image/${image.name}`)
      .put(image)
      .then(({ ref }) => {
        ref.getDownloadURL().then((url) => {
          Firebase.firestore()
            .collection("products")
            .add({
              name,
              category,
              price,
              description,
              url,
              location,
              userId: user.uid,
              createdAt: date,
            })
            .then(() => {
              console.log("Uploaded");
              setLoading(false);
              navigate("/");
            });
        });
      });
  };
  return (
    <Fragment>
      <Header />
      {loading && <GoLoading />}
      <div className="centerDiv">
        <label>Name</label>
        <br />
        <input
          className="input"
          type="text"
          name="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <br />
        <label>Category:</label>
        <select
          name="Category"
          onChange={(e) => {
            setCategory(e.target.value);
          }}
          className="input"
        >
          {" "}
          <option>Select Category</option>
          <option value="Auditoriums">Auditorium</option>
          <option value="Gyms">Gym</option>
          <option value="Swimming Pools">Swimming Pool</option>
          <option value="Cafes">Cafe</option>
          <option value="Open Grounds">Open Grounds</option>
          <option value="Lounges">Lounges</option>
        </select>
        <br />
        <label>Price</label>
        <br />
        <input
          className="input"
          type="number"
          name="Price"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
          }}
        />
        <br />
        <label>Description</label>
        <br />
        <input
          className="input"
          type="text"
          name="Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <br />
        <label>Location</label>
        <br />
        <input
          className="input"
          type="text"
          name="Description"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
          }}
        />
        <br />

        <br />
        <img
          alt="Posts"
          width="200px"
          height="200px"
          src={image ? URL.createObjectURL(image) : ""}
        ></img>

        <br />
        <input
          type="file"
          onChange={(e) => {
            setImage(e.target.files[0]);
          }}
        />
        <br />
        <button className="uploadBtn" onClick={handleSubmit}>
          Upload and Submit
        </button>
      </div>
    </Fragment>
  );
};

export default Create;
