import React from 'react'
import WelcomeCard from '../components/Home-Component/WelcomeCard'
import StatsCards from '../components/Home-Component/StatsCards'
import QuickActions from '../components/Home-Component/QuickActions'
import HomePlaces from '../components/HomePlaces'
import { useTheme } from '../context/ThemeContext'
const Home = () => {

    const { isDark } = useTheme();
    return (
        <div className="min-h-screen">
            <div className="p-4 sm:p-6 lg:p-8">
                <WelcomeCard />
                <StatsCards />
                <QuickActions />
                <HomePlaces />
            </div>
        </div>
    )
}

export default Home
