import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets'; // Ensure this is correctly imported
import axios from "axios";
import { toast } from 'react-toastify';

const Add = ({ url }) => {
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
    image: null, // Added image to the data state
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onImageChange = (event) => {
    setData((prevState) => ({
      ...prevState,
      image: event.target.files[0], // Save the selected image file
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // If there's no image selected, show an error toast
    if (!data.image) {
      toast.error("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price)); // Ensure price is a number
    formData.append("image", data.image); // Appending the image file

    try {
      const response = await axios.post(`${url}/api/food/add`, formData);

      if (response.data.success) {
        // Reset form and show success toast
        setData({
          name: "",
          description: "",
          price: "",
          image: null, // Reset image state
        });
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Server error, please try again later.");
    }
  };

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            {data.image ? (
              <img src={URL.createObjectURL(data.image)} alt="Uploaded Preview" />
            ) : (
              <img src={assets.upload_area} alt="Upload Icon" />
            )}
          </label>
          <input
            onChange={onImageChange}
            type="file"
            id="image"
            hidden
            required
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            placeholder="Write content here"
            required
          ></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="BDT 20"
            />
          </div>
        </div>

        <button type="submit" className="add-btn">Add</button>
      </form>
    </div>
  );
};

export default Add;
