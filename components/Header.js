import React from 'react'
import Link from 'next/link'

export default function Header({ children }) {
  return (
    <header>
      <Link href="/">
        <a>Home</a>
      </Link>
    </header>
  )
}
