// pages/index.js

import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Welcome to the Next.js homepage!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to the Home Page</h1>
        <p>This is the home page of your Next.js app.</p>
        
        <nav>
          <ul>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </nav>
      </main>

      <footer>
        <p>© 2024 Next.js App</p>
      </footer>
    </div>
  );
}
