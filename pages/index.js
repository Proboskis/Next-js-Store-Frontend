import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import {useQuery} from "urql";
import {PRODUCT_QUERY} from "../lib/query";
import Product from "../components/Product";
import {Gallery} from "../styles/Gallery";

export default function Home() {
    // Fetch products from strapi
    const [results] = useQuery({query: PRODUCT_QUERY});
    const {data, fetching, error} = results;
    // Check for the data coming in
    if (fetching) return <p>Loading ...</p>
    if (error) return <p>Oh no... {error.message}</p>
    const products = data.products.data;

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
          <h1>Next JS</h1>
          <Gallery>
              {products.map((product) => (
                  <Product product={product} key={product.attributes.slug} />
              ))}
          </Gallery>
      </main>
    </div>
  )
}
