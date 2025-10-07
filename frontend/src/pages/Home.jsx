// Home.js
import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <main className="space-y-16 pb-16">
      <Header />
      <section className="container mx-auto px-4">
        <SpecialityMenu />
        <TopDoctors />
        <Banner />
      </section>
    </main>
  )
}

export default Home






// import React from 'react'
// import Header from '../components/Header'
// import SpecialityMenu from '../components/SpecialityMenu'
// import TopDoctors from '../components/TopDoctors'
// import Banner from '../components/Banner'

// const Home = () => {
//   return (
//     <div>
//       <Header />
//       <SpecialityMenu />
//       <TopDoctors />
//       <Banner />
//     </div>
//   )
// }

// export default Home