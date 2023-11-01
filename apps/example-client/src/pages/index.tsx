import { Foo } from '@bitmetro/persona-react';

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <button className=''>Login</button>
      <Foo />
    </main>
  )
}
