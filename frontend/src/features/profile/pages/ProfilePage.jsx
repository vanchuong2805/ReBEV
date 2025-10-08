import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileHeader from '../components/ProfileHeader'
import StatsGrid from '../components/StatsGrid'
import SidebarNav from '../components/SidebarNav'
import TransactionsSection from '../components/transactions/TransactionsSection'
import WatchlistTab from '../components/WatchlistTab'
import ListingsSection from '../components/listings/ListingsSection'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import PurchasesSection from '../components/purchases/PurchasesSection'
import SalesSection from '../components/sales/SalesSection'
import FavoritesList from '../components/favorites/FavoritesList'
import SettingsPage from '../components/settings/SettingsPage'
const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('overview')


    const userData = {
        name: 'Nguyễn Văn Nam',
        email: 'nam.nguyen@email.com',
        phone: '+84 901 234 567',
        location: 'TP.HCM, Việt Nam',
        memberSince: 'Tháng 3, 2023',
        avatar: 'https://picsum.photos/120',
        rating: 4.8,
        totalReviews: 47,
        verificationStatus: 'Đã xác thực',
        memberLevel: 'Gold'
    }


    const stats = {
        totalListings: 8,
        soldItems: 15,
        purchases: 3,
        earnings: '₫245,000,000',
        saved: 12,
        views: 1247
    }




    return (
        <>
            <Header />
            <div className='min-h-screen bg-gradient-to-br from-blue-50 to-green-50'>
                <div className='container mx-auto px-4 py-8 max-w-7xl'>
                    <ProfileHeader userData={userData} />
                    <StatsGrid stats={stats} />
                    <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
                        <div className='lg:col-span-1'>
                            <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
                        </div>

                        <div className='lg:col-span-3'>
                            <Tabs value={activeTab} onValueChange={setActiveTab}>


                                <TabsContent value='listings'>
                                    <ListingsSection />
                                </TabsContent>

                                <TabsContent value='purchases'>
                                    <PurchasesSection />
                                </TabsContent>

                                <TabsContent value='sales'>
                                    <SalesSection />
                                </TabsContent>
                                <TabsContent value='transactions'>
                                    <TransactionsSection />
                                </TabsContent>

                                <TabsContent value='favorites'>
                                    <FavoritesList />
                                </TabsContent>
                                <TabsContent value='settings'>
                                    <SettingsPage />
                                </TabsContent>

                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>

    )
}


export default ProfilePage