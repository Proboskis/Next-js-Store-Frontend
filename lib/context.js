import React, {createContext, useContext, useState} from "react";

const ShopContext = createContext();

export const StateContext = ({children}) => {
    // Add our data for the state
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [qty, setQty] = useState(1);

    // Increase product quantity
    const increaseQty = () => {
        setQty((prevQty) => prevQty + 1);
    }

    // Decrease product quantity
    const decreaseQty = () => {
        setQty(prevQty => {
            if (prevQty - 1 < 1) return 1;
            return prevQty - 1;
        });
    }
    
    // Add product to cart
    const onAdd = (product, quantity) => {
        // Check if the product is already in the cart
        const exists = cartItems.find(item => item.slug === product.slug);
        if (exists) {
            setCartItems(cartItems.map((item) => item.slug === product.slug ? {...exists, quantity: exists.quantity + quantity} : item));
        } else {
            setCartItems([...cartItems, {...product, quantity: quantity}]);
        }
    }

    // Remove product
    const OnRemove = (product) => {
        // Check if the product is already in the cart
        const exists = cartItems.find(item => item.slug === product.slug);
        // console.log(exists);
        if(exists.quantity === 1) {
            setCartItems(cartItems.filter(item => item.slug !== product.slug))
        } else {
            setCartItems(cartItems.map(item => item.slug === product.slug ? {...exists, quantity: exists.quantity - 1} : item));
        }
    }

    return (
        <ShopContext.Provider value={{qty, increaseQty, decreaseQty, showCart, setShowCart, cartItems, onAdd, OnRemove}}>
            {children}
        </ShopContext.Provider>
    );
}

export const useStateContext = () => useContext(ShopContext);