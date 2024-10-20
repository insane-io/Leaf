import React, { useEffect, useState } from 'react';
import CreateAxiosInstance from "../Axios";

const Redeem = () => {
  const axiosInstance = CreateAxiosInstance();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [totalCredits, setTotalCredits] = useState(0);
  const [products, setProducts] = useState([]);
  const [flag, setflag] = useState(false);

  const totalCreditsRequired = selectedProducts.reduce((total, product) => total + product.worth, 0);

  const handleSelectProduct = (product) => {
    const isSelected = selectedProducts.some(selected => selected.id === product.id);
    
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter(selected => selected.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleRedeem = async () => {
    const productIds = selectedProducts.map(product => product.id);

    const formData = new FormData();
    productIds.forEach(id => formData.append('pro_id', id)); // Append each product ID to FormData

    try {
      const response = await axiosInstance.post('redeem_coupon/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccessMessage('Product redeemed successfully!');
      setSelectedProducts([]);
      const updatedProfile = await axiosInstance('profile/');
      setTotalCredits(updatedProfile.data.credit_coins);
      setflag(!flag); // To trigger a re-render and refetch data
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function getData() {
      try {
        const res = await axiosInstance.get('get_product/');
        const profileRes = await axiosInstance.get('profile/');
        setProducts(res.data);
        setTotalCredits(profileRes.data.credit_coins);
      } catch (error) {
        console.log(error);
      }
    }
    getData();
  }, [flag]);

  return (
    <div className="mx-8 my-10">
      <h1 className="text-3xl font-bold mb-6">Redeem Your Credits</h1>
      <p className="text-lg mb-4">Total Credits: <span className="font-bold">{totalCredits}</span></p>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {products.map(product => (
          <div
            key={product.id}
            onClick={() => handleSelectProduct(product)} // Handle product selection
            className={`p-4 border rounded-lg cursor-pointer ${selectedProducts.some(selected => selected.id === product.id) ? 'border-green-500 bg-green-100' : 'border-gray-300'}`}
          >
            <img src={`${product.photo}`} alt={product.name} className="w-full h-32 object-cover rounded" />
            <h3 className="text-lg font-medium mt-2">{product.title}</h3>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="font-bold mt-2">Credits Required: {product.worth}</p>
          </div>
        ))}
      </div>
      <button
        onClick={handleRedeem}
        className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 ${totalCreditsRequired === 0 || totalCredits < totalCreditsRequired ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={totalCreditsRequired === 0 || totalCredits < totalCreditsRequired}
      >
        Redeem Product
      </button>
      {successMessage && (
        <div className="mt-6 text-green-600 font-medium">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default Redeem;
