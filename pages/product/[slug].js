import {useQuery} from 'urql';
import {GET_PRODUCT_KEY} from '../../lib/query';
import {useRouter} from "next/router";
import {DetailsStyle, ProductInfo, Quantity, Buy} from "../../styles/ProductDetails";
import {AiFillPlusCircle, AiFillMinusCircle} from "react-icons/ai";
import {useStateContext} from "../../lib/context";
import {useEffect} from "react";
import toast from "react-hot-toast";

export default function ProductDetails() {
    // Use State
    const {qty, setQty, increaseQty, decreaseQty, cartItems, onAdd} = useStateContext();
    // console.log(qty);

    // Fetch Slug
    const {query} = useRouter();
    // console.log(query);

    // Fetch Graphql
    const [results] = useQuery({
        query: GET_PRODUCT_KEY,
        variables: {slug: query.slug}
    });
    const {data, fetching, error} = results;

    // reset the number of items added to the cart with useEffect hook
    useEffect(() => {
        setQty(1)
    }, [setQty]);

    // Check for the data coming in
    if (fetching) return <p>Loading ...</p>
    if (error) return <p>Oh no... {error.message}</p>

    // const products = data.products.data;
    // console.log(data);

    const {title, description, image} = data.products.data[0].attributes;
    // console.log(data.products.data[0].attributes);

    // Create a toast
    const notify = () => {
        toast.success(`${title} added to your cart.`, {duration: 1500});
    }

    return(
        <DetailsStyle>
            <img src={image.data.attributes.formats.medium.url} alt={title} />
            <ProductInfo>
                <h3>{title}</h3>
                <p>{description}</p>
            <Quantity>
                <span>Quantity</span>
                <button>
                    <AiFillMinusCircle  onClick={decreaseQty} />
                </button>
                <p>{qty}</p>
                <button>
                    <AiFillPlusCircle onClick={increaseQty} />
                </button>
            </Quantity>
                <Buy onClick={() => {
                    onAdd(data.products.data[0].attributes, qty);
                    notify();
                    }
                }>Add to cart</Buy>
            </ProductInfo>
        </DetailsStyle>
    );
}