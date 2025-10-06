import React from 'react'
import { Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'


const Bar = ({ percent }) => {
    const safe = Math.max(0, Math.min(100, percent ?? 0))
    return (
        <div className='flex-1 h-2 rounded bg-gray-200'>
            <div className='h-2 rounded bg-yellow-400' style={{ width: `${safe}%` }} />
        </div>
    )
}


const ReviewsTab = ({ userData, starCounts }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Đánh giá & Phản hồi</CardTitle>
                <CardDescription>Đánh giá từ người mua và người bán</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='space-y-6'>
                    <div className='text-center p-6 border rounded-lg bg-gray-50'>
                        <div className='flex items-center justify-center gap-2 mb-2'>
                            <Star className='w-8 h-8 fill-yellow-400 text-yellow-400' />
                            <span className='text-3xl font-bold'>{userData.rating}</span>
                        </div>
                        <p className='text-gray-600'>{userData.totalReviews} đánh giá</p>


                        <div className='mt-4 space-y-2'>
                            {[5, 4, 3, 2, 1].map(star => {
                                const count = starCounts[star] ?? 0
                                const percent = userData.totalReviews ? Math.round((count / userData.totalReviews) * 100) : 0
                                return (
                                    <div key={star} className='flex items-center gap-2'>
                                        <span className='text-sm w-4'>{star}</span>
                                        <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                                        <Bar percent={percent} />
                                        <span className='text-sm text-gray-500 w-8 text-right'>{count}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>


                    <div className='space-y-4'>
                        <h3 className='font-semibold text-lg'>Đánh giá gần đây</h3>
                        {[1, 2, 3].map(i => (
                            <div key={i} className='border rounded-lg p-4'>
                                <div className='flex items-start gap-4'>
                                    <img src='https://picsum.photos/40/40' alt='Reviewer' className='w-10 h-10 rounded-full' />
                                    <div className='flex-1'>
                                        <div className='flex items-center gap-2 mb-2'>
                                            <span className='font-medium'>Trần Minh Hoàng</span>
                                            <div className='flex'>
                                                {[...Array(5)].map((_, j) => (
                                                    <Star key={j} className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                                                ))}
                                            </div>
                                            <span className='text-sm text-gray-500'>2024-08-15</span>
                                        </div>
                                        <p className='text-gray-700'>
                                            Người bán rất uy tín, xe đúng như mô tả. Giao dịch nhanh chóng, thủ tục đầy đủ. Sẽ giới thiệu cho bạn bè!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


export default ReviewsTab