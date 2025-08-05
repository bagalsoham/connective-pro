import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout/index.jsx";

export default function Home() {
  const router = useRouter();
  return (
    <UserLayout> 
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer__left}>
            <p>Connect with your friends without Exaggeration!</p>

            <p>A true social media platform with stories no Blufs</p>
            <div
              onClick={() => router.push("/login")}
              className={styles.buttonJoin}>
              <p>Join Now</p>
            </div>
          </div>

          <div className={styles.mainContainer__right}>
            <img
              src="/images/homemain_connection.png"
              alt="Connection Illustration"
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
