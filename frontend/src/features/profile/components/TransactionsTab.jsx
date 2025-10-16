import React from 'react'
import { TrendingUp, ShoppingCart, Star, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'


const TransactionsTab = ({ transactionHistory }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Lịch sử giao dịch</CardTitle>
                <CardDescription>Tất cả giao dịch mua bán của bạn</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='space-y-4'>
                    {transactionHistory.map(transaction => (
                        <div key={transaction.id} className='border rounded-lg p-6'>
                            <div className='flex items-center justify-between mb-4'>
                                <div className='flex items-center gap-4'>
                                    <div className={`p-3 rounded-full ${transaction.type === 'sell' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {transaction.type === 'sell' ? <TrendingUp className='w-5 h-5' /> : <ShoppingCart className='w-5 h-5' />}
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-lg'>{transaction.item}</h3>
                                        <p className='text-gray-600'>
                                            {transaction.type === 'sell' ? `Bán cho ${transaction.buyer}` : `Mua từ ${transaction.seller}`}
                                        </p>
                                    </div>
                                </div>
                                <div className='text-right'>
                                    <div className='text-2xl font-bold text-green-600'>{transaction.amount}</div>
                                    <div className='text-sm text-gray-500'>{transaction.date}</div>
                                </div>
                            </div>


                            <div className='flex items-center justify-between pt-4 border-t'>
                                <div className='flex items-center gap-1'>
                                    <span className='text-sm text-gray-600'>Đánh giá:</span>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < transaction.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <Button size='sm' variant='outline'>
                                    <FileText className='w-4 h-4 mr-2' />
                                    Xem hợp đồng
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}


export default TransactionsTab