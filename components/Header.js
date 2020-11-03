import React from 'react'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/">
        <a className={styles.header_element}>
          <img
            src="/favicon.ico"
            alt="image"
          />
        </a>
      </Link>
      <Link href="/LogIn">
        <a className={styles.header_element}>
          Log in
        </a>
      </Link>
    </header>
  )
}
