import React from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import FindUs from '../../components/FindUs/FindUs'

const Home = () => {
  return (
    <div>
      <Header />
      <ExploreMenu />
      <FoodDisplay />
      <FindUs />
    </div>
  )
}

export default Home
