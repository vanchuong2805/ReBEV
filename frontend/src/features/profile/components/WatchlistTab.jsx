import React from 'react'
import { Battery, Heart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'


const WatchlistTab = ({ watchlist }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Danh sách quan tâm</CardTitle>
                <CardDescription>Xe và pin bạn đang theo dõi</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='grid gap-4'>
                    {watchlist.map(item => (
                        <div key={item.id} className='border rounded-lg p-6'>
                            <div className='flex gap-6'>
                                <img src={item.image} alt={item.title} className='w-32 h-24 object-cover rounded-lg' />
                                <div className='flex-1'>
                                    <div className='flex items-start justify-between mb-4'>
                                        <div>
                                            <h3 className='text-xl font-semibold mb-2'>{item.title}</h3>
                                            <div className='flex items-center gap-4 text-gray-600'>
                                                <span className='flex items-center gap-1'>
                                                    <Battery className='w-4 h-4' />
                                                    {item.batteryHealth}% pin
                                                </span>
                                            </div>
                                        </div>
                                        <Button size='sm' variant='outline' aria-label='Toggle favorite'>
                                            <Heart className='w-4 h-4' />
                                        </Button>
                                    </div>


                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <span className='text-2xl font-bold text-green-600'>{item.price}</span>
                                            <span className={`ml-2 text-sm ${item.priceChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                {item.priceChange > 0 ? '+' : ''}{item.priceChange}%
                                            </span>
                                        </div>
                                        <div className='flex gap-2'>
                                            <Button size='sm'>Liên hệ</Button>
                                            <Button size='sm' variant='outline'>Xem chi tiết</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}


export default WatchlistTab