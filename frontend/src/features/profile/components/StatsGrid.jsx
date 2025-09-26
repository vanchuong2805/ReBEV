import React from 'react'
import { Car, DollarSign, TrendingUp, Heart, Eye ,ShoppingBag} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'


const StatsGrid = ({ stats }) => {
    return (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8'>
            <Card>
                <CardContent className='p-4 text-center'>
                    <Car className='w-6 h-6 mx-auto mb-2 text-blue-600' />
                    <div className='text-2xl font-bold text-blue-600'>{stats.totalListings}</div>
                    <div className='text-sm text-gray-600'>Đang bán</div>
                </CardContent>
            </Card>


            <Card>
                <CardContent className='p-4 text-center'>
                    <DollarSign className='w-6 h-6 mx-auto mb-2 text-green-600' />
                    <div className='text-2xl font-bold text-green-600'>{stats.soldItems}</div>
                    <div className='text-sm text-gray-600'>Đã bán</div>
                </CardContent>
            </Card>


            <Card>
                <CardContent className='p-4 text-center'>
                    <ShoppingBag className='w-6 h-6 mx-auto mb-2 text-orange-600' />
                    <div className='text-2xl font-bold text-orange-600'>{stats.purchases}</div>
                    <div className='text-sm text-gray-600'>Đã mua</div>
                </CardContent>
            </Card>


            <Card>
                <CardContent className='p-4 text-center'>
                    <TrendingUp className='w-6 h-6 mx-auto mb-2 text-purple-600' />
                    <div className='text-lg font-bold text-purple-600'>{stats.earnings}</div>
                    <div className='text-sm text-gray-600'>Doanh thu</div>
                </CardContent>
            </Card>


            <Card>
                <CardContent className='p-4 text-center'>
                    <Heart className='w-6 h-6 mx-auto mb-2 text-red-600' />
                    <div className='text-2xl font-bold text-red-600'>{stats.saved}</div>
                    <div className='text-sm text-gray-600'>Yêu thích</div>
                </CardContent>
            </Card>

        </div>
    )
}


export default StatsGrid