import Link from "next/link"

const ForwardPage = () => {
  return (
    <>
      <p>Forwarded after login</p>
      <div>
        <Link href="/">
          <button>
            Return home
          </button>
        </Link>
      </div>
    </>
  )
}

export default ForwardPage;
