import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../../assets/assets'; 
import api from "../../../utils/api";
import { toast } from 'react-toastify';

const Add = () => {
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Biryani", // Default matching backend model
    image: null,
  });

  const [isDragOver, setIsDragOver] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setData((prevState) => ({
        ...prevState,
        image: file,
      }));
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setData((prevState) => ({
        ...prevState,
        image: file,
      }));
    } else {
      toast.error("Please drop a valid image file.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!data.image) {
      toast.error("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", data.image);

    try {
      const response = await api.post('/api/food/add', formData);

      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Biryani",
          image: null,
        });
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error, please try again later.");
    }
  };

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <div
            className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <label htmlFor="image">
              {data.image ? (
                <img src={URL.createObjectURL(data.image)} alt="Uploaded Preview" />
              ) : (
                <div className="upload-placeholder">
                  <img src={assets.upload_area} alt="Upload Icon" />
                  <p>Click to upload or drag and drop</p>
                </div>
              )}
            </label>
            <input
              onChange={onImageChange}
              type="file"
              id="image"
              hidden
              accept="image/*"
              required
            />
          </div>
        </div>

        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
            required
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
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select name="category" onChange={onChangeHandler} value={data.category}>
              <option value="Biryani">Biryani</option>
              <option value="Rice">Rice</option>
              <option value="Curry">Curry</option>
              <option value="Fish">Fish</option>
              <option value="Shawarma">Shawarma</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Special">Special</option>
              <option value="Vegetable">Vegetable</option>
              <option value="Beverage">Beverage</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="BDT 20"
              required
            />
          </div>
        </div>

        <button type="submit" className="add-btn">Add Product</button>
      </form>
    </div>
  );
};

export default Add;
