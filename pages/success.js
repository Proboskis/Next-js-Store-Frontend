import {useRouter} from "next/router";
import Image from "next/image";
import shiba_inu from "../public/shiba_inu.png";
import styled from "styled-components";
const {motion} = require("framer-motion");

const stripe = require('stripe')(`${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`);

export async function getServerSideProps(params) {
    const order = await stripe.checkout.sessions.retrieve(
        params.query.session_id,
        {
            expand: ["line_items"],
        }
    );
    console.log(params.query);
    return { props: {order}}
}

export default function Success({order}) {
    const route = useRouter();
    console.log(order);
    return (
        <Wrapper>
            <Card animate={{opacity: 1, scale: 1}} initial={{opacity: 0, scale: 0.75}} transition={{duration: 0.75}}>
                <h1>Thank you for your order.</h1>
                <h2>A confirmation email has been sent to</h2>
                <h2>{order.customer_details.email}</h2>
                <Address>
                    <h3>Address</h3>
                    {Object.entries(order.customer_details.address).map(
                        ([key, value]) => (
                            <p key={key}>
                                {key} : {value}
                            </p>
                        )
                    )}
                </Address>
                <OrderInfo>
                    <h3>Products</h3>
                    {order.line_items.data.map(item => (
                        <InfoWrapper key={item.id}>
                            <p>Product: {item.description}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: {item.price.unit_amount}</p>
                        </InfoWrapper>
                    ))}
                </OrderInfo>
                <button onClick={() => route.push('/')}>Continue Shopping</button>
                <Image src={shiba_inu} alt="shiba-inu"/>
           </Card>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    margin: 5rem 0rem;
    display: flex;
    justify-content: center;
    align-items: center
`;

const Card = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    border-radius: 2rem;
    padding: 3rem 3rem;
    width: 50%;
    h1 {
        color: var(--primary);
        margin-bottom: 1rem;
    }
    h2 {
        color: var(--secondary);
        font-weight: 500
        margin-bottom: 0.5rem;
    }
    button {
        color: white;
        background: var(--primary);
        font-size: 1.2rem;
        font-weight: 500;
        padding: 1rem 2rem;
        margin-top: 2rem;
        cursor: pointer;
    }
    padding: 1rem 2rem;
    cursor: pointer;
`;

const Address = styled.div`
    font-size: 1rem;
    width: 100%;
`;

const OrderInfo = styled.div`
    font-size: 1rem;
    width: 100%;
    div {
        padding-bottom: 1rem;
    }
`;

const InfoWrapper = styled.div`
    margin-top: 2rem;
    display: flex;
`;