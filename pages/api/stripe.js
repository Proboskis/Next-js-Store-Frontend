import Stripe from 'stripe';
import {getSession} from "@auth0/nextjs-auth0";

const stripe = new Stripe(`${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`);

export default async function handler (req, res) {
    const session = getSession(req, res);
    const user = session?.user;
    // console.log(user);
    if (user) {
        const stripeId = user['http://localhost:3000/stripe_customer_id'];
        if (req.method === "POST") {
            // console.log(req.body);
            try {
                const lineItems = [];
                for(let item of req.body) {
                    lineItems.push({
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: item.title,
                                images: [item.image.data.attributes.formats.thumbnail.url],
                            },
                            unit_amount:  Math.round(item.price * 100),
                        },
                        adjustable_quantity: {
                            enabled: true,
                            minimum: 1,
                        },
                        quantity: item.quantity,
                    });
                }
                // Create checkout session
                const session = await stripe.checkout.sessions.create({
                    submit_type: 'pay',
                    mode: 'payment',
                    customer: stripeId,
                    payment_method_types: ['card'],
                    shipping_address_collection: {
                        allowed_countries: ['AR', 'AU', 'AT', 'BE', 'BO', 'BR', 'BG', 'CA', 'CL', 'CO', 'CR', 'HR', 'CY', 'CZ', 'DK', 'DO', 'EG', 'EE', 'FI', 'FR', 'DE', 'GR', 'HK', 'HU', 'IS', 'IN', 'ID', 'IE', 'IL', 'IT', 'JP', 'LV', 'LI', 'LT', 'LU', 'MT', 'MX', 'NL', 'NZ', 'NO', 'PY', 'PE', 'PL', 'PT', 'RO', 'SG', 'SK', 'SI', 'ES', 'SE', 'CH', 'TH', 'TT', 'AE', 'GB', 'US', 'UY']
                    },
                    allow_promotion_codes: true,
                    shipping_options: [
                        {shipping_rate: 'shr_1LhBPTCn0MQXbsg2RHzq4SyB'},
                        {shipping_rate: 'shr_1LhBgUCn0MQXbsg2VrfLwD6y'}
                    ],
                    line_items: lineItems,
                    // Redirect to the successful or failed page
                    success_url: `${req.headers.origin}/success?&session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${req.headers.origin}/canceled`,
                });
                res.status(200).json(session);
            } catch (e) {
                res.status(e.statusCode || 500).json(e.message);
            }
        } else {
            res.setHeader("Allow", "POST");
            res.status(405).end("Method Not Allowed");
        }
    } else {
        if (req.method === "POST") {
            // console.log(req.body);
            try {
                const lineItems = [];
                for(let item of req.body) {
                    lineItems.push({
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: item.title,
                                images: [item.image.data.attributes.formats.thumbnail.url],
                            },
                            unit_amount:  Math.round(item.price * 100),
                        },
                        adjustable_quantity: {
                            enabled: true,
                            minimum: 1,
                        },
                        quantity: item.quantity,
                    });
                }
                // Create checkout session
                const session = await stripe.checkout.sessions.create({
                    submit_type: 'pay',
                    mode: 'payment',
                    payment_method_types: ['card'],
                    shipping_address_collection: {
                        allowed_countries: ['AR', 'AU', 'AT', 'BE', 'BO', 'BR', 'BG', 'CA', 'CL', 'CO', 'CR', 'HR', 'CY', 'CZ', 'DK', 'DO', 'EG', 'EE', 'FI', 'FR', 'DE', 'GR', 'HK', 'HU', 'IS', 'IN', 'ID', 'IE', 'IL', 'IT', 'JP', 'LV', 'LI', 'LT', 'LU', 'MT', 'MX', 'NL', 'NZ', 'NO', 'PY', 'PE', 'PL', 'PT', 'RO', 'SG', 'SK', 'SI', 'ES', 'SE', 'CH', 'TH', 'TT', 'AE', 'GB', 'US', 'UY']
                    },
                    allow_promotion_codes: true,
                    shipping_options: [
                        {shipping_rate: 'shr_1LhBPTCn0MQXbsg2RHzq4SyB'},
                        {shipping_rate: 'shr_1LhBgUCn0MQXbsg2VrfLwD6y'}
                    ],
                    line_items: lineItems,
                    // Redirect to the successful or failed page
                    success_url: `${req.headers.origin}/success?&session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${req.headers.origin}/canceled`,
                });
                res.status(200).json(session);
            } catch (e) {
                res.status(e.statusCode || 500).json(e.message);
            }
        } else {
            res.setHeader("Allow", "POST");
            res.status(405).end("Method Not Allowed");
        }
    }
}