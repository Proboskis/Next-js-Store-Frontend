import {useQuery} from 'urql';
import {GET_PRODUCT_KEY} from '../../lib/query';
import {useRouter} from "next/router";
import {DetailsStyle, ProductInfo, Quantity, Buy} from "../../styles/ProductDetails";
import {AiFillPlusCircle, AiFillMinusCircle} from "react-icons/ai";
import {useStateContext} from "../../lib/context";

export default function ProductDetails() {
    // Use State
    const {qty, increaseQty, decreaseQty, cartItems, onAdd} = useStateContext();
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

    // Check for the data coming in
    if (fetching) return <p>Loading ...</p>
    if (error) return <p>Oh no... {error.message}</p>

    // const products = data.products.data;
    // console.log(data);

    const {title, description, image} = data.products.data[0].attributes;
    console.log(data.products.data[0].attributes);

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
                <Buy onClick={() => onAdd(data.products.data[0].attributes, qty)}>Add to cart</Buy>
            </ProductInfo>
        </DetailsStyle>
    );
}