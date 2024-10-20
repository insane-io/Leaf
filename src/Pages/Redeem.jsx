import React, { useState } from 'react';

const products = [
  {
    id: 1,
    name: 'Tree',
    description: 'Plant a tree to help combat climate change.',
    credits: 50,
    imageUrl: 'https://via.placeholder.com/150?text=Tree', // Replace with actual tree image URL
  },
  {
    id: 2,
    name: 'Natural Soap',
    description: 'Eco-friendly natural soap made from organic ingredients.',
    credits: 30,
    imageUrl: 'https://via.placeholder.com/150?text=Natural+Soap', // Replace with actual product image URL
  },
];

const Redeem = () => {
  const [selectedProducts, setSelectedProducts] = useState([]); // Track selected products
  const [successMessage, setSuccessMessage] = useState('');
  const [totalCredits, setTotalCredits] = useState(100); // Example total credits

  // Calculate total credits required for selected products
  const totalCreditsRequired = selectedProducts.reduce((total, product) => total + product.credits, 0);

  const handleToggleProduct = (product) => {
    if (selectedProducts.some(selected => selected.id === product.id)) {
      setSelectedProducts(prev => prev.filter(selected => selected.id !== product.id)); // Deselect product
    } else {
      setSelectedProducts(prev => [...prev, product]); // Select product
    }
  };

  const handleRedeem = () => {
    if (totalCredits >= totalCreditsRequired) {
      setTotalCredits(prevCredits => prevCredits - totalCreditsRequired); // Deduct credits
      setSuccessMessage(`Successfully redeemed for ${selectedProducts.map(product => product.name).join(', ')}!`);
      setSelectedProducts([]); // Reset selection after redemption
    } else {
      setSuccessMessage('Not enough credits to redeem the selected products.');
    }
  };

  return (
    <div className="mx-8 my-10">
      <h1 className="text-3xl font-bold mb-6">Redeem Your Credits</h1>
      <p className="text-lg mb-4">Total Credits: <span className="font-bold">{totalCredits}</span></p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map(product => (
          <div
            key={product.id}
            className={`p-4 border rounded-lg cursor-pointer ${selectedProducts.some(selected => selected.id === product.id) ? 'border-green-500 bg-green-100' : 'border-gray-300'}`}
            onClick={() => handleToggleProduct(product)} // Toggle product selection
          >
            <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover rounded" />
            <h3 className="text-lg font-medium mt-2">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="font-bold mt-2">Credits Required: {product.credits}</p>
          </div>
        ))}
      </div>
      <button
        onClick={handleRedeem}
        className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 ${totalCreditsRequired === 0 || totalCredits < totalCreditsRequired ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={totalCreditsRequired === 0 || totalCredits < totalCreditsRequired}
      >
        Redeem Products
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
