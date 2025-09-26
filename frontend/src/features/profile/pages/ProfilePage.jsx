import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileHeader from '../components/ProfileHeader'
import StatsGrid from '../components/StatsGrid'
import SidebarNav from '../components/SidebarNav'
import TransactionsTab from '../components/TransactionsTab'
import WatchlistTab from '../components/WatchlistTab'
import ReviewsTab from '../components/ReviewsTab'
import PurchasesTab from '../components/PurchasesTab'
import ListingsSection from '../components/listings/ListingsSection'
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


    const currentListings = [
        {
            id: 1,
            title: "Tesla Model 3 2020 - Pin 75kWh",
            price: "₫850,000,000",
            views: 234,
            status: "Đang bán",
            image: "/api/placeholder/200/150",
            batteryHealth: 92,
            mileage: "45,000 km"
        },
        {
            id: 2,
            title: "VinFast VF8 Battery Pack 87.7kWh",
            price: "₫180,000,000",
            views: 156,
            status: "Đang bán",
            image: "/api/placeholder/200/150",
            batteryHealth: 88,
            condition: "Như mới"
        },

        {
            id: 3,
            title: "Nissan Leaf 2019 - Pin 40kWh",
            price: "₫410,000,000",
            views: 98,
            status: "Đang bán",
            image: "/api/placeholder/200/150",
            batteryHealth: 85,
            mileage: "62,000 km"
        },
        {
            id: 10,
            title: "BMW iX3 2022 - Pin 74kWh",
            price: "₫1,120,000,000",
            views: 54,
            status: "Đang bán",
            image: "/api/placeholder/200/150",
            batteryHealth: 94,
            mileage: "18,000 km"
        },
        {
            id: 12,
            title: "Hyundai Ioniq 5 2022 - Pin 72.6kWh",
            price: "₫920,000,000",
            views: 204,
            status: "Đang bán",
            image: "/api/placeholder/200/150",
            batteryHealth: 96,
            mileage: "22,000 km"
        },
        {
            id: 5,
            title: "BYD Blade Battery 60kWh",
            price: "₫95,000,000",
            views: 63,
            status: "Đang bán",
            image: "/api/placeholder/200/150",
            batteryHealth: 90,
            condition: "Tốt"
        },

        {
            id: 4,
            title: "Hyundai Kona Electric 2021 - Pin 64kWh",
            price: "₫610,000,000",
            status: "Chờ duyệt",
            image: "/api/placeholder/200/150",
            batteryHealth: 93,
            mileage: "28,000 km",
            createdAt: "2025-09-20"
        },
        {
            id: 9,
            title: "Tesla Model Y Battery 75kWh",
            price: "₫210,000,000",
            status: "Chờ duyệt",
            image: "/api/placeholder/200/150",
            batteryHealth: 91,
            createdAt: "2025-09-22"
        },

        {
            id: 6,
            title: "Peugeot e-208 2022 - Pin 50kWh",
            price: "₫520,000,000",
            status: "Đã bán",
            image: "/api/placeholder/200/150",
            batteryHealth: 89,
            mileage: "15,000 km",
            buyer: "Trần Minh Hoàng",
            rating: 5,
            soldAt: "2024-08-15"
        },
        {
            id: 7,
            title: "Nissan Leaf Battery 40kWh",
            price: "₫88,000,000",
            status: "Đã bán",
            image: "/api/placeholder/200/150",
            batteryHealth: 82,
            condition: "Đã dùng",
            buyer: "Phạm Đức Minh",
            rating: 4,
            soldAt: "2025-06-10"
        },

        {
            id: 8,
            title: "Renault Zoe 2020 - Pin 52kWh",
            price: "₫380,000,000",
            status: "Tin ẩn",
            image: "/api/placeholder/200/150",
            batteryHealth: 86,
            mileage: "32,000 km",
            expiredAt: "2025-09-10"
        },
        {
            id: 11,
            title: "VinFast VF e34 Battery 42kWh",
            price: "₫120,000,000",
            status: "Tin ẩn",
            image: "/api/placeholder/200/150",
            batteryHealth: 80,
            expiredAt: "2025-08-30"
        }
    ]

    const transactionHistory = [
        {
            id: 1,
            type: 'sell',
            item: 'Hyundai Kona Electric 2021',
            amount: '₫420,000,000',
            date: '2024-08-15',
            buyer: 'Trần Minh Hoàng',
            rating: 5
        },
        {
            id: 2,
            type: 'buy',
            item: 'BYD Blade Battery 60kWh',
            amount: '₫85,000,000',
            date: '2024-07-22',
            seller: 'Lê Thị Hoa',
            rating: 4
        },
        {
            id: 3,
            type: 'sell',
            item: 'Nissan Leaf Battery 40kWh',
            amount: '₫95,000,000',
            date: '2024-06-10',
            buyer: 'Phạm Đức Minh',
            rating: 5
        }
    ]


    const watchlist = [
        {
            id: 1,
            title: 'BMW iX3 2022 - Pin 74kWh',
            price: '₫1,200,000,000',
            priceChange: -5,
            image: 'https://picsum.photos/150/100',
            batteryHealth: 95
        },
        {
            id: 2,
            title: 'Tesla Model Y Battery 75kWh',
            price: '₫220,000,000',
            priceChange: 3,
            image: 'https://picsum.photos/150/100?2',
            batteryHealth: 89
        }
    ]



    return (
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
                                <ListingsSection currentListings={currentListings} />
                            </TabsContent>
                            <TabsContent value='purchases'>
                                <PurchasesTab currentListings={currentListings} />
                            </TabsContent>
                            <TabsContent value='transactions'>
                                <TransactionsTab transactionHistory={transactionHistory} />
                            </TabsContent>
                            <TabsContent value='watchlist'>
                                <WatchlistTab watchlist={watchlist} />
                            </TabsContent>

                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default ProfilePage